import { z } from 'zod';

const name = z.string().trim().min(2, 'Mind. 2 Zeichen').max(120, 'Zu lang');

const email = z.email('Ungültige E-Mail').trim().toLowerCase().max(254, 'Zu lang');

const phone = z
	.string()
	.trim()
	.refine((v) => v === '' || /^[+()\-0-9\s]{6,30}$/.test(v), 'Ungültige Telefonnummer')
	.transform((v) => v.replace(/\s+/g, ''));

const street = z.string().trim().min(3, 'Mind. 3 Zeichen').max(200, 'Zu lang');
const additionalAddress = z.string().trim().max(100, 'Zu lang');
const postalCode = z
	.string()
	.trim()
	.refine((v) => v === '' || /^[0-9]{4,10}$/.test(v), 'Ungültige Postleizahl');
const city = z.string().trim().min(2, 'Mind. 2 Zeichen').max(100, 'Zu lang');
const country = z.string().trim().min(2, 'Mind. 2 Zeichen').max(100, 'Zu lang');

export const CustomerSchema = z.object({
	firstName: name,
	lastName: name,
	email: email.optional().or(z.literal('')),
	phone: phone.optional().or(z.literal('')),
	street: street.optional().or(z.literal('')),
	additionalAddress: additionalAddress.optional().or(z.literal('')),
	postalCode: postalCode.optional().or(z.literal('')),
	city: city.optional().or(z.literal('')),
	country: country.optional().or(z.literal(''))
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

export const customerIdSchema = z.uuid('Ungültige Kunden-ID');
export const ConsentFileSchema = z
	.instanceof(File)
	.refine((file) => file.size > 0, 'Datei ist leer')
	.refine((file) => file.size <= 1024 * 1024 * 15, 'Die Datei darf maximal 15 MB groß sein.')
	.refine(
		(file) => file.type === 'application/pdf' || file.type === 'text/plain',
		'Nur PDF- und Textdateien sind erlaubt.'
	);
