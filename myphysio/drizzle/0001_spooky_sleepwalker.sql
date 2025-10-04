CREATE TABLE "customer" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"email" text,
	"phone_number" text,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "customer_consent" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"storage_bucket" text NOT NULL,
	"storage_key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"sha256_hex" text NOT NULL,
	"is_latest" boolean DEFAULT true NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet" (
	"pet_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"species_id" integer,
	"breed" text,
	"age" date,
	"medical_history" text,
	"customer_id" integer
);
--> statement-breakpoint
CREATE TABLE "species" (
	"species_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_species_id_species_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("species_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_customer_created_id" ON "customer" USING btree ("created_at","customer_id");--> statement-breakpoint
CREATE INDEX "ix_customer_name" ON "customer" USING btree ("name");--> statement-breakpoint
CREATE INDEX "ix_customer_email" ON "customer" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ix_customer_phone" ON "customer" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "ix_pet_customer_id" ON "pet" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "ix_pet_species_id" ON "pet" USING btree ("species_id");--> statement-breakpoint
CREATE INDEX "ix_pet_name" ON "pet" USING btree ("name");--> statement-breakpoint
CREATE INDEX "ix_pet_breed" ON "pet" USING btree ("breed");--> statement-breakpoint
CREATE INDEX "ix_species_name" ON "species" USING btree ("name");