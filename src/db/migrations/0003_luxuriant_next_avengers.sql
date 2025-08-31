CREATE TABLE "pic_to_dra_daily_trials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pic_to_dra_daily_trials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_uuid" varchar(255),
	"ip_address" varchar(45) NOT NULL,
	"trial_date" varchar(10) NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "user_daily_trial_unique" UNIQUE("user_uuid","trial_date"),
	CONSTRAINT "ip_daily_trial_unique" UNIQUE("ip_address","trial_date")
);
