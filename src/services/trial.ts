import { dailyTrials } from "@/db/schema";
import { db } from "@/db";
import { and, eq, or } from "drizzle-orm";
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

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if user can use daily trial
export async function checkDailyTrial(userUuid?: string): Promise<TrialCheckResult> {
  try {
    const today = getTodayString();
    const clientIP = await getClientIP();

    // For logged in users, block by either user or IP; otherwise block by IP only
    const trialCondition = userUuid
      ? and(
          eq(dailyTrials.trial_date, today),
          or(
            eq(dailyTrials.user_uuid, userUuid),
            eq(dailyTrials.ip_address, clientIP)
          )
        )
      : and(
          eq(dailyTrials.trial_date, today),
          eq(dailyTrials.ip_address, clientIP)
        );

    const existingTrial = await db()
      .select({ id: dailyTrials.id })
      .from(dailyTrials)
      .where(trialCondition)
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

// Record daily trial usage
export async function recordDailyTrial(userUuid?: string): Promise<void> {
  try {
    const today = getTodayString();
    const clientIP = await getClientIP();

    const insertResult = await db()
      .insert(dailyTrials)
      .values({
        user_uuid: userUuid || null,
        ip_address: clientIP,
        trial_date: today,
        created_at: new Date(getIsoTimestr()),
      })
      .onConflictDoNothing()
      .returning({ id: dailyTrials.id });

    if (insertResult.length > 0) {
      console.log(`Daily trial recorded for ${userUuid ? `user ${userUuid}` : `IP ${clientIP}`}`);
    } else if (process.env.NODE_ENV !== "production") {
      console.log(
        `Daily trial already recorded for ${
          userUuid ? `user ${userUuid}` : `IP ${clientIP}`
        } on ${today}, skipping insert.`
      );
    }
  } catch (error) {
    console.error('Error recording daily trial:', error);
    throw error;
  }
}
