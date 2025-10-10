-- First, delete any records with NULL user_uuid (old non-logged-in trials)
DELETE FROM "pic_to_dra_daily_trials" WHERE "user_uuid" IS NULL;--> statement-breakpoint
-- Drop the IP constraint
ALTER TABLE "pic_to_dra_daily_trials" DROP CONSTRAINT "ip_daily_trial_unique";--> statement-breakpoint
-- Set user_uuid to NOT NULL
ALTER TABLE "pic_to_dra_daily_trials" ALTER COLUMN "user_uuid" SET NOT NULL;