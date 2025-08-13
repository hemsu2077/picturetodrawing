CREATE TABLE "pic_to_dra_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pic_to_dra_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" varchar(255) NOT NULL,
	"user_uuid" varchar(255) NOT NULL,
	"original_image_url" varchar(500),
	"generated_image_url" varchar(500) NOT NULL,
	"style" varchar(50) NOT NULL,
	"ratio" varchar(50),
	"provider" varchar(50) DEFAULT 'replicate' NOT NULL,
	"filename" varchar(255),
	"status" varchar(50) DEFAULT 'completed' NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "pic_to_dra_images_uuid_unique" UNIQUE("uuid")
);
