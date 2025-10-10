import { dailyTrials } from "@/db/schema";
import { db } from "@/db";
import { and, eq, or, desc } from "drizzle-orm";
import { getIsoTimestr } from "@/lib/time";
import { headers } from "next/headers";

export interface TrialCheckResult {
  canUseTrial: boolean;
  isTrialUsage: boolean; // true if this would be a trial usage, false if needs credits
}

// Get client IP address from request headers
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  
  // Try different headers in order of preference
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = headersList.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default IP if none found
  return '127.0.0.1';
}

// Get today's date in YYYY-MM-DD format (UTC timezone)
// IMPORTANT: Always use UTC to avoid timezone inconsistencies
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if user can use daily trial (requires login)
export async function checkDailyTrial(userUuid?: string): Promise<TrialCheckResult> {
  try {
    // Daily trial now requires login
    if (!userUuid) {
      return {
        canUseTrial: false,
        isTrialUsage: false
      };
    }

    const today = getTodayString();

    // Check if user has already used trial today
    const existingTrial = await db()
      .select({ id: dailyTrials.id })
      .from(dailyTrials)
      .where(
        and(
          eq(dailyTrials.trial_date, today),
          eq(dailyTrials.user_uuid, userUuid)
        )
      )
      .limit(1);
    
    const canUseTrial = existingTrial.length === 0;
    
    return {
      canUseTrial,
      isTrialUsage: canUseTrial
    };
  } catch (error) {
    console.error('Error checking daily trial:', error);
    // On error, assume trial cannot be used to be safe
    return {
      canUseTrial: false,
      isTrialUsage: false
    };
  }
}

// Record daily trial usage (requires login)
export async function recordDailyTrial(userUuid?: string): Promise<void> {
  try {
    if (!userUuid) {
      throw new Error('User UUID is required for daily trial');
    }

    const today = getTodayString();
    const clientIP = await getClientIP();

    await db()
      .insert(dailyTrials)
      .values({
        user_uuid: userUuid,
        ip_address: clientIP,
        trial_date: today,
        created_at: new Date(getIsoTimestr()),
      })
      .onConflictDoNothing();
  } catch (error) {
    console.error('Error recording daily trial:', error);
    throw error;
  }
}
