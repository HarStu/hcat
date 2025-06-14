CREATE TABLE "chats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"content" varchar(8191) NOT NULL,
	"reasoning" varchar(8191),
	"experimental_attachments" jsonb,
	"role" varchar(16) NOT NULL,
	"data" jsonb,
	"annotations" jsonb,
	"toolInvocations" jsonb,
	"parts" jsonb,
	"chatId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hcat_post" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "hcat_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "hcat_post" USING btree ("name");