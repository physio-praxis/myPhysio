import { uuid } from "zod";
import type { PageServerLoad } from "../$types";
import { customer, customerConsent } from "$lib/server/db/schema";
import { db } from "$lib/server/db/db";
import { eq, desc } from "drizzle-orm";
import { error, fail, type Actions } from "@sveltejs/kit";
import { CustomerSchema, type CustomerInput } from "$lib/validation/app/customer/customer.schema";

export const load: PageServerLoad = async ({ params }) => {
    const id = uuid().parse(params.customerId);

    const [ cus ] = await db
        .select()
        .from(customer)
        .where(eq(customer.customerId, parseInt(id)))
        .limit(1);

    if (!cus) {
        throw error(404, 'Kunde nicht gefunden');
    }

    const latestConsent = await db
        .select()
        .from(customerConsent)
        .where(eq(customerConsent.customerId, cus.customerId))
        .orderBy(desc(customerConsent.uploadedAt))
        .limit(1);

    return { customer: cus, consent: latestConsent[0] ?? null };
};

type FieldErrors = Partial<Record<keyof CustomerInput | 'consent', string[]>>;
interface ActionData {
  ok: false;
  errors: FieldErrors;
  values: Partial<CustomerInput>;
}

export const actions: Actions = {
    default: async ({ request, params }) => {
        const id = uuid().parse(params.customerId);
        const formData = await request.formData();
        const values = {
            name: (formData.get('name') ?? '') as string,
            email: (formData.get('email') ?? '') as string,
            phone: (formData.get('phone') ?? '') as string,
            address: (formData.get('address') ?? '') as string
        };

        const parsed = CustomerSchema.safeParse(values);
        if (!parsed.success) {
            const errors = parsed.error.flatten((issue) => issue.message).fieldErrors as FieldErrors;
            const data: ActionData = { ok: false, errors, values };
            return fail(400, data);
        }
    }
}