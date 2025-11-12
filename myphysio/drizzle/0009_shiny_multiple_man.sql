DROP VIEW "public"."customer_details_view";--> statement-breakpoint
DROP VIEW "public"."customer_search_view";--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "additional_address" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "postalCode" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "country" text;--> statement-breakpoint
CREATE INDEX "ix_customer_city" ON "customer" USING btree ("city");--> statement-breakpoint
CREATE INDEX "ix_customer_street" ON "customer" USING btree ("street");--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "address";--> statement-breakpoint
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
									'age', p.age::text,
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