CREATE TABLE "pic_to_dra_checkins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pic_to_dra_checkins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_uuid" varchar(255) NOT NULL,
	"checkin_date" varchar(10) NOT NULL,
	"consecutive_days" integer DEFAULT 1 NOT NULL,
	"credits_earned" integer NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "user_date_unique" UNIQUE("user_uuid","checkin_date")
);
