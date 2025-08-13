import { images } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and, gte, inArray } from "drizzle-orm";

export async function insertImage(
  data: typeof images.$inferInsert
): Promise<typeof images.$inferSelect | undefined> {
  if (data.created_at && typeof data.created_at === "string") {
    data.created_at = new Date(data.created_at);
  }
  if (data.updated_at && typeof data.updated_at === "string") {
    data.updated_at = new Date(data.updated_at);
  }

  const [image] = await db().insert(images).values(data).returning();

  return image;
}

export async function findImageByUuid(
  uuid: string
): Promise<typeof images.$inferSelect | undefined> {
  const [image] = await db()
    .select()
    .from(images)
    .where(eq(images.uuid, uuid))
    .limit(1);

  return image;
}

export async function getImagesByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db()
    .select()
    .from(images)
    .where(eq(images.user_uuid, user_uuid))
    .orderBy(desc(images.created_at))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function getImagesByUserUuids(
  user_uuids: string[],
  page: number = 1,
  limit: number = 50
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db()
    .select()
    .from(images)
    .where(inArray(images.user_uuid, user_uuids))
    .orderBy(desc(images.created_at))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function updateImage(
  uuid: string,
  data: Partial<typeof images.$inferInsert>
): Promise<typeof images.$inferSelect | undefined> {
  if (data.updated_at === undefined) {
    data.updated_at = new Date();
  } else if (typeof data.updated_at === "string") {
    data.updated_at = new Date(data.updated_at);
  }

  const [image] = await db()
    .update(images)
    .set(data)
    .where(eq(images.uuid, uuid))
    .returning();

  return image;
}

export async function deleteImage(
  uuid: string
): Promise<typeof images.$inferSelect | undefined> {
  const [image] = await db()
    .delete(images)
    .where(eq(images.uuid, uuid))
    .returning();

  return image;
}

export async function deleteImagesByUserUuid(
  user_uuid: string
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const deletedImages = await db()
    .delete(images)
    .where(eq(images.user_uuid, user_uuid))
    .returning();

  return deletedImages;
}

export async function getImagesByStyle(
  style: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db()
    .select()
    .from(images)
    .where(eq(images.style, style))
    .orderBy(desc(images.created_at))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function getImagesByStatus(
  status: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db()
    .select()
    .from(images)
    .where(eq(images.status, status))
    .orderBy(desc(images.created_at))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function getImagesByDateRange(
  user_uuid: string,
  start_date: string,
  end_date: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof images.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db()
    .select()
    .from(images)
    .where(
      and(
        eq(images.user_uuid, user_uuid),
        gte(images.created_at, new Date(start_date)),
        gte(images.created_at, new Date(end_date))
      )
    )
    .orderBy(desc(images.created_at))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function getImageCountByUserUuid(
  user_uuid: string
): Promise<number> {
  const count = await db()
    .select({ count: images.id })
    .from(images)
    .where(eq(images.user_uuid, user_uuid));

  return count.length;
}

export async function getTotalImageCount(): Promise<number> {
  const total = await db().$count(images);

  return total;
}