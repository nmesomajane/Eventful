CREATE TYPE "public"."reminder_status" AS ENUM('pending', 'sent', 'cancelled');--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"offset_minutes" integer NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"status" "reminder_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "reminder_offsets" integer[] DEFAULT '{1440}' NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "custom_reminder_offsets" integer[];--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;