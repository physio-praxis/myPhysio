import { z } from 'zod';

const name = z.string().trim().min(2, 'Mind. 2 Zeichen').max(120, 'Zu lang');

const email = z.email('Ungültige E-Mail').trim().toLowerCase().max(254, 'Zu lang');

const phone = z
	.string()
	.trim()
	.refine((v) => v === '' || /^[+()\-0-9\s]{6,30}$/.test(v), 'Ungültige Telefonnummer')
	.transform((v) => v.replace(/\s+/g, ''));

const address = z.string().trim().max(1000, 'Zu lang');

export const CustomerSchema = z.object({
	name: name,
	email: email,
	phone: phone,
	address: address
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

export const customerIdSchema = z.uuid('Ungültige Kunden-ID');
export const ConsentFileSchema = z
	.instanceof(File)
	.refine(file => file.size > 0, 'Datei ist leer')
	.refine(file => file.size <= 1024 * 1024 * 15, 'Die Datei darf maximal 15 MB groß sein.')
	.refine(
		file => file.type === 'application/pdf' || file.type === 'text/plain',
		'Nur PDF- und Textdateien sind erlaubt.'
	);