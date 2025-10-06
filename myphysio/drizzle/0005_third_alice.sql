CREATE TABLE "invoice" (
	"invoice_id" serial PRIMARY KEY NOT NULL,
	"date_issued" timestamp with time zone DEFAULT now() NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"customer_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_treatment" (
	"pet_treatment_id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"treatmentId" integer NOT NULL,
	"invoice_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatment" (
	"treatment_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_pet_id_pet_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("pet_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_treatmentId_treatment_treatment_id_fk" FOREIGN KEY ("treatmentId") REFERENCES "public"."treatment"("treatment_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pet_treatment" ADD CONSTRAINT "pet_treatment_invoice_id_invoice_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("invoice_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_invoice_customer" ON "invoice" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_invoice_date" ON "invoice" USING btree ("date_issued");--> statement-breakpoint
CREATE INDEX "idx_invoice_customer_date" ON "invoice" USING btree ("customer_id","date_issued");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_pet" ON "pet_treatment" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_treatment" ON "pet_treatment" USING btree ("treatmentId");--> statement-breakpoint
CREATE INDEX "idx_pettreatment_invoice" ON "pet_treatment" USING btree ("invoice_id");