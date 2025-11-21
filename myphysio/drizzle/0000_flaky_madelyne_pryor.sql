CREATE TABLE "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"supabase_user_id" uuid,
	CONSTRAINT "auth_user_email_unique" UNIQUE("email"),
	CONSTRAINT "auth_user_supabase_user_id_unique" UNIQUE("supabase_user_id")
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"street" text NOT NULL,
	"additional_address" text,
	"postalCode" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	CONSTRAINT "customer_email_unique" UNIQUE("email"),
	CONSTRAINT "customer_phone_number_unique" UNIQUE("phone_number")
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
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customer_consent_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"invoice_id" serial PRIMARY KEY NOT NULL,
	"date_issued" timestamp with time zone DEFAULT now() NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"customer_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet" (
	"pet_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"species_id" integer,
	"breed" text NOT NULL,
	"birthdate" date,
	"medical_history" text,
	"customer_id" integer
);
--> statement-breakpoint
CREATE TABLE "pet_treatment" (
	"pet_treatment_id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"treatment_id" integer NOT NULL,
	"invoice_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "species" (
	"species_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "species_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "treatment" (
	"treatment_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer_consent" ADD CONSTRAINT "customer_consent_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_species_id_species_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("species_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_pet_id_pet_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("pet_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_treatment_id_treatment_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("treatment_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_invoice_id_invoice_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("invoice_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_customer_created_id" ON "customer" USING btree ("created_at","customer_id");--> statement-breakpoint
CREATE INDEX "ix_customer_first_name" ON "customer" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "ix_customer_last_name" ON "customer" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX "ix_customer_email" ON "customer" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ix_customer_phone" ON "customer" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "ix_customer_city" ON "customer" USING btree ("city");--> statement-breakpoint
CREATE INDEX "ix_customer_street" ON "customer" USING btree ("street");--> statement-breakpoint
CREATE INDEX "idx_invoice_customer" ON "invoice" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_invoice_date" ON "invoice" USING btree ("date_issued");--> statement-breakpoint
CREATE INDEX "idx_invoice_customer_date" ON "invoice" USING btree ("customer_id","date_issued");--> statement-breakpoint
CREATE INDEX "ix_pet_customer_id" ON "pet" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "ix_pet_species_id" ON "pet" USING btree ("species_id");--> statement-breakpoint
CREATE INDEX "ix_pet_name" ON "pet" USING btree ("name");--> statement-breakpoint
CREATE INDEX "ix_pet_breed" ON "pet" USING btree ("breed");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_pet" ON "pet_treatment" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_treatment" ON "pet_treatment" USING btree ("treatment_id");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_invoice" ON "pet_treatment" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "ix_species_name" ON "species" USING btree ("name");--> statement-breakpoint
CREATE VIEW "public"."customer_details_view" WITH (security_invoker = true) AS (select "customer"."customer_id", "customer"."created_at", "customer"."first_name", "customer"."last_name", "customer"."email", "customer"."phone_number", "customer"."street", "customer"."additional_address", "customer"."postalCode", "customer"."city", "customer"."country", ("customer_consent"."id" IS NOT NULL) as "has_consent", "customer_consent"."filename", "customer_consent"."uploaded_at", 
					COALESCE(
						(
							SELECT jsonb_agg(
								jsonb_build_object(
									'petId', p.pet_id,
									'name', p.name,
									'speciesId', p.species_id,
									'species', s.name,
									'breed', p.breed,
									'birthdate', p.birthdate::text,
									'age', DATE_PART('YEAR',AGE(p.birthdate)),
									'medicalHistory', p.medical_history
								)
								ORDER BY p.created_at DESC, p.pet_id
							)
							FROM public.pet p
							LEFT JOIN public.species s ON s.species_id = p.species_id
							WHERE p.customer_id = "customer"."customer_id"
						), '[]'::jsonb
					)
				 as "pets", 
					COALESCE(
						(
							SELECT jsonb_agg(
								jsonb_build_object(
									'petTreatmentId', t5.pet_treatment_id,
									'createdAt', t5.created_at,
									'petId', t5.pet_id,
									'petName', t5.pet_name,
									'treatmentId', t5.treatment_id,
									'treatmentName', t5.treatment_name,
									'invoiceId', t5.invoice_id,
									'invoiceAmount', t5.invoice_amount,
									'invoiceDate', t5.invoice_date
								)
								ORDER BY t5.created_at DESC, t5.pet_treatment_id
							)
							FROM (
								SELECT
									pt.pet_treatment_id AS pet_treatment_id,
									pt.created_at AS created_at,
									pt.pet_id AS pet_id,
									p.name AS pet_name,
									t.treatment_id AS treatment_id,
									t.name AS treatment_name,
									pt.invoice_id AS invoice_id,
									i.amount::text AS invoice_amount,
									i.date_issued AS invoice_date
								FROM public.pet_treatment pt
								JOIN public.pet p ON p.pet_id = pt.pet_id
								JOIN public.treatment t ON t.treatment_id = pt.treatment_id
								LEFT JOIN public.invoice i ON i.invoice_id = pt.invoice_id
								WHERE p.customer_id = "customer"."customer_id"
								ORDER BY pt.created_at DESC, pt.pet_treatment_id DESC
								LIMIT 5
							) AS t5
						), '[]'::jsonb
					)
				 as "last5_treatments" from "customer" left join "customer_consent" on ("customer_consent"."customer_id" = "customer"."customer_id" and ("customer_consent"."is_latest") = TRUE));--> statement-breakpoint
CREATE VIEW "public"."customer_search_view" WITH (security_invoker = true) AS (select "customer"."customer_id", "customer"."created_at", "customer"."first_name", "customer"."last_name", "customer"."email", "customer"."phone_number", "customer"."street", "customer"."additional_address", "customer"."postalCode", "customer"."city", "customer"."country", 
					COALESCE(
						STRING_AGG(
							CASE
								WHEN "pet"."pet_id" IS NULL THEN NULL
								WHEN "species"."name" IS NOT NULL THEN (COALESCE("pet"."name", '(Ohne Name)') || ' (' || "species"."name" || ')')
								ELSE COALESCE("pet"."name", '(Ohne Name)')
							END,
							', ' ORDER BY "pet"."pet_id")
						FILTER (WHERE "pet"."pet_id" IS NOT NULL),
						'')
					 as "pets_line", 
					COALESCE(
						STRING_AGG(LOWER(CONCAT_WS(' ', "pet"."name", "pet"."breed", "species"."name")), ' ' ORDER BY "pet"."pet_id")
						FILTER (WHERE "pet"."pet_id" IS NOT NULL),
						''
					)
				 as "pets_text", 
					EXISTS(
						SELECT 1
						FROM "customer_consent"
						WHERE "customer_consent"."customer_id" = "customer"."customer_id" AND "customer_consent"."is_latest" = TRUE
					)
				 as "has_consent" from "customer" left join "pet" on "pet"."customer_id" = "customer"."customer_id" left join "species" on "species"."species_id" = "pet"."species_id" group by "customer"."customer_id", "customer"."created_at", "customer"."first_name", "customer"."last_name", "customer"."email", "customer"."phone_number", "customer"."street", "customer"."additional_address", "customer"."postalCode", "customer"."city", "customer"."country");