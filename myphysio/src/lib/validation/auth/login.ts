import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    password: z.string().min(6, "Dein Passwort muss mindestens 6 Zeichen lang sein.").max(200, "Dein Passwort ist zu lang.")
});

export type LoginInput = z.infer<typeof loginSchema>;