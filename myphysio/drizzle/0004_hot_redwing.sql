DROP VIEW "public"."customer_search_view";--> statement-breakpoint
CREATE VIEW "public"."customer_search_view" WITH (security_invoker = true) AS (select "customer"."customer_id", "customer"."created_at", "customer"."name", "customer"."email", "customer"."phone_number", "customer"."address", 
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
				 as "has_consent" from "customer" left join "pet" on "pet"."customer_id" = "customer"."customer_id" left join "species" on "species"."species_id" = "pet"."species_id" group by "customer"."customer_id", "customer"."created_at", "customer"."name", "customer"."email", "customer"."phone_number", "customer"."address");