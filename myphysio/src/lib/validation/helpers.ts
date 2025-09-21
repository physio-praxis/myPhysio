import { z } from "zod";

export function zodToErrors(errors: z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of errors.issues) {
        const key = issue.path.join(".") || "_form";
        if (!fieldErrors[key]) {
            fieldErrors[key] = issue.message;
        }
    }
    return fieldErrors;
};