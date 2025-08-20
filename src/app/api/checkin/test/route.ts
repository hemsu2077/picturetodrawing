import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { respJson } from "@/lib/resp";
import { db } from "@/db";
import { checkins } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getIsoTimestr } from "@/lib/time";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.uuid) {
      return respJson(401, "Unauthorized");
    }

    const body = await request.json();
    const { action, days, targetDate } = body;

    switch (action) {
      case "set_consecutive_days":
        return await setConsecutiveDays(session.user.uuid, days);
      case "reset_all":
        return await resetAllCheckins(session.user.uuid);
      case "simulate_break":
        return await simulateBreak(session.user.uuid, days);
      case "simulate_day8":
        return await simulateDay8(session.user.uuid);
      default:
        return respJson(400, "Invalid action");
    }
  } catch (error) {
    console.error("Test checkin API error:", error);
    return respJson(500, "Internal server error");
  }
}

async function setConsecutiveDays(user_uuid: string, days: number) {
  try {
    // 删除现有签到记录
    await db().delete(checkins).where(eq(checkins.user_uuid, user_uuid));

    // 创建连续签到记录
    const today = new Date();
    const records = [];
    
    for (let i = days; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      // 计算正确的连续天数（从第1天开始递增）
      const consecutiveDayNumber = days - i + 1;
      const dayIndex = Math.min(consecutiveDayNumber - 1, 6);
      const credits = [2, 2, 4, 2, 4, 2, 8][dayIndex];
      
      records.push({
        user_uuid,
        checkin_date: dateStr,
        consecutive_days: consecutiveDayNumber,
        credits_earned: credits,
        created_at: new Date(getIsoTimestr()),
      });
    }

    await db().insert(checkins).values(records);

    return respJson(0, `Successfully set ${days} consecutive days`, { days });
  } catch (error) {
    console.error("Set consecutive days failed:", error);
    return respJson(500, "Failed to set consecutive days");
  }
}

async function resetAllCheckins(user_uuid: string) {
  try {
    await db().delete(checkins).where(eq(checkins.user_uuid, user_uuid));
    return respJson(0, "All checkins reset successfully");
  } catch (error) {
    console.error("Reset checkins failed:", error);
    return respJson(500, "Failed to reset checkins");
  }
}

async function simulateBreak(user_uuid: string, lastStreakDays: number) {
  try {
    // 删除现有签到记录
    await db().delete(checkins).where(eq(checkins.user_uuid, user_uuid));

    // 创建中断前的签到记录（3天前结束）
    const records = [];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // 3天前结束签到
    
    for (let i = lastStreakDays; i >= 1; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - (i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      // 计算正确的连续天数（从第1天开始递增）
      const consecutiveDayNumber = lastStreakDays - i + 1;
      const dayIndex = Math.min(consecutiveDayNumber - 1, 6);
      const credits = [2, 2, 4, 2, 4, 2, 8][dayIndex];
      
      records.push({
        user_uuid,
        checkin_date: dateStr,
        consecutive_days: consecutiveDayNumber,
        credits_earned: credits,
        created_at: new Date(getIsoTimestr()),
      });
    }

    await db().insert(checkins).values(records);

    return respJson(0, `Simulated break: ${lastStreakDays} days streak ended 3 days ago`);
  } catch (error) {
    console.error("Simulate break failed:", error);
    return respJson(500, "Failed to simulate break");
  }
}

async function simulateDay8(user_uuid: string) {
  try {
    // 删除现有签到记录
    await db().delete(checkins).where(eq(checkins.user_uuid, user_uuid));

    // 创建完整7天签到记录（从8天前到昨天）
    const records = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (8 - i)); // 从8天前开始到昨天
      const dateStr = date.toISOString().split('T')[0];
      
      // 第i天对应consecutive_days = i
      const consecutiveDayNumber = i;
      const dayIndex = Math.min(consecutiveDayNumber - 1, 6);
      const credits = [2, 2, 4, 2, 4, 2, 8][dayIndex];
      
      records.push({
        user_uuid,
        checkin_date: dateStr,
        consecutive_days: consecutiveDayNumber,
        credits_earned: credits,
        created_at: new Date(getIsoTimestr()),
      });
    }

    await db().insert(checkins).values(records);

    return respJson(0, "Simulated completed 7-day streak, today is day 8 (new cycle starts)");
  } catch (error) {
    console.error("Simulate day 8 failed:", error);
    return respJson(500, "Failed to simulate day 8");
  }
}
