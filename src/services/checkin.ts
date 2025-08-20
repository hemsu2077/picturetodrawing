import {
  findCheckinByUserAndDate,
  getLastCheckinByUser,
  getUserCheckinStreak,
  insertCheckin,
} from "@/models/checkin";
import { increaseCredits, CreditsTransType } from "@/services/credit";
import { getIsoTimestr } from "@/lib/time";

// Daily rewards pattern: 2, 2, 4, 2, 4, 2, 8
const DAILY_REWARDS = [2, 2, 4, 2, 4, 2, 8];

export interface CheckinResult {
  success: boolean;
  message: string;
  credits_earned?: number;
  consecutive_days?: number;
  already_checked_in?: boolean;
}

export async function performCheckin(user_uuid: string): Promise<CheckinResult> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already checked in today
    const existingCheckin = await findCheckinByUserAndDate(user_uuid, today);
    if (existingCheckin) {
      return {
        success: false,
        message: "Already checked in today",
        already_checked_in: true,
        credits_earned: existingCheckin.credits_earned,
        consecutive_days: existingCheckin.consecutive_days,
      };
    }

    // Get current streak
    const streak = await getUserCheckinStreak(user_uuid);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let consecutive_days = 1;
    
    // Calculate consecutive days
    if (streak.last_checkin_date === yesterday) {
      // Continue streak, but reset to 1 if completed 7 days
      if (streak.consecutive_days >= 7) {
        consecutive_days = 1; // Reset to Day 1 after completing 7 days
      } else {
        consecutive_days = streak.consecutive_days + 1;
      }
    } else if (streak.last_checkin_date === today) {
      // Already checked in today (shouldn't happen due to earlier check)
      consecutive_days = streak.consecutive_days;
    }
    // If streak.last_checkin_date is older than yesterday, streak resets to 1

    // Calculate credits based on consecutive days
    const credits_earned = DAILY_REWARDS[consecutive_days - 1] || DAILY_REWARDS[6]; // Default to day 7 reward

    // Create checkin record
    await insertCheckin({
      user_uuid,
      checkin_date: today,
      consecutive_days,
      credits_earned,
      created_at: new Date(getIsoTimestr()),
    });

    // Add credits to user account (valid for 1 month)
    const expiredAt = new Date();
    expiredAt.setMonth(expiredAt.getMonth() + 1);
    
    await increaseCredits({
      user_uuid,
      trans_type: CreditsTransType.DailyCheckin,
      credits: credits_earned,
      expired_at: expiredAt.toISOString(),
    });

    return {
      success: true,
      message: `Successfully checked in! Earned ${credits_earned} credits.`,
      credits_earned,
      consecutive_days,
      already_checked_in: false,
    };
  } catch (error) {
    console.error("Checkin failed:", error);
    return {
      success: false,
      message: "Checkin failed. Please try again.",
    };
  }
}

export async function getUserCheckinStatus(user_uuid: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckin = await findCheckinByUserAndDate(user_uuid, today);
    
    if (todayCheckin) {
      // 如果今天已签到，直接返回今天的签到记录
      return {
        checked_in_today: true,
        consecutive_days: todayCheckin.consecutive_days,
        last_checkin_date: todayCheckin.checkin_date,
        today_credits: todayCheckin.credits_earned,
      };
    } else {
      // 如果今天未签到，获取历史连续签到信息
      const streak = await getUserCheckinStreak(user_uuid);
      return {
        checked_in_today: false,
        consecutive_days: streak.consecutive_days,
        last_checkin_date: streak.last_checkin_date,
        today_credits: 0,
      };
    }
  } catch (error) {
    console.error("Get checkin status failed:", error);
    return {
      checked_in_today: false,
      consecutive_days: 0,
      last_checkin_date: null,
      today_credits: 0,
    };
  }
}

export function getRewardForDay(day: number): number {
  return DAILY_REWARDS[Math.min(day - 1, 6)] || DAILY_REWARDS[6];
}
