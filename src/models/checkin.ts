import { checkins } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and, gte, lte } from "drizzle-orm";

export async function insertCheckin(
  data: typeof checkins.$inferInsert
): Promise<typeof checkins.$inferSelect | undefined> {
  if (data.created_at && typeof data.created_at === "string") {
    data.created_at = new Date(data.created_at);
  }

  const [checkin] = await db().insert(checkins).values(data).returning();
  return checkin;
}

export async function findCheckinByUserAndDate(
  user_uuid: string,
  checkin_date: string
): Promise<typeof checkins.$inferSelect | undefined> {
  const [checkin] = await db()
    .select()
    .from(checkins)
    .where(
      and(
        eq(checkins.user_uuid, user_uuid),
        eq(checkins.checkin_date, checkin_date)
      )
    )
    .limit(1);

  return checkin;
}

export async function getLastCheckinByUser(
  user_uuid: string
): Promise<typeof checkins.$inferSelect | undefined> {
  const [checkin] = await db()
    .select()
    .from(checkins)
    .where(eq(checkins.user_uuid, user_uuid))
    .orderBy(desc(checkins.checkin_date))
    .limit(1);

  return checkin;
}

export async function getUserCheckinHistory(
  user_uuid: string,
  limit: number = 30
): Promise<(typeof checkins.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(checkins)
    .where(eq(checkins.user_uuid, user_uuid))
    .orderBy(desc(checkins.checkin_date))
    .limit(limit);

  return data;
}

export async function getUserCheckinStreak(
  user_uuid: string
): Promise<{ consecutive_days: number; last_checkin_date: string | null }> {
  const lastCheckin = await getLastCheckinByUser(user_uuid);
  
  if (!lastCheckin) {
    return { consecutive_days: 0, last_checkin_date: null };
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // If last checkin was today or yesterday, return the streak
  if (lastCheckin.checkin_date === today || lastCheckin.checkin_date === yesterday) {
    return {
      consecutive_days: lastCheckin.consecutive_days,
      last_checkin_date: lastCheckin.checkin_date,
    };
  }

  // If last checkin was more than 1 day ago, streak is broken
  return { consecutive_days: 0, last_checkin_date: lastCheckin.checkin_date };
}
