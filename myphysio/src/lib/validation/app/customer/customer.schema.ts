import { z } from 'zod';

const name = z.string().trim().min(2, 'Mind. 2 Zeichen').max(120, 'Zu lang');

const email = z.email('Ungültige E-Mail').trim().toLowerCase().max(254, 'Zu lang');

const phone = z
	.string()
	.trim()
	.refine((v) => v === '' || /^[+()\-0-9\s]{6,30}$/.test(v), 'Ungültige Telefonnummer')
	.transform((v) => v.replace(/\s+/g, ''));

const address = z.string().trim().max(1000, 'Zu lang');

export const CustomerCreateSchema = z.object({
	name: name,
	email: email,
	phone: phone,
	address: address
});

export type CustomerCreateInput = z.infer<typeof CustomerCreateSchema>;
