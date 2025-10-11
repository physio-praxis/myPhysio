DROP VIEW "public"."customer_details_view";--> statement-breakpoint
ALTER TABLE "pet_treatment" RENAME COLUMN "treatmentId" TO "treatment_id";--> statement-breakpoint
ALTER TABLE "pet_treatment" DROP CONSTRAINT "pet_treatment_treatmentId_treatment_treatment_id_fk";
--> statement-breakpoint
DROP INDEX "idx_pettreatment_treatment";--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_treatment_id_treatment_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("treatment_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_pettreatment_treatment" ON "pet_treatment" USING btree ("treatment_id");--> statement-breakpoint
CREATE VIEW "public"."customer_details_view" WITH (security_invoker = true) AS (select "customer"."customer_id", "customer"."created_at", "customer"."name", "customer"."email", "customer"."phone_number", "customer"."address", ("customer_consent"."id" IS NOT NULL) as "has_consent", "customer_consent"."filename", "customer_consent"."uploaded_at", 
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
				 as "last5_treatments" from "customer" left join "customer_consent" on ("customer_consent"."customer_id" = "customer"."customer_id" and ("customer_consent"."is_latest") = TRUE));