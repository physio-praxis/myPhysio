export type FormType = {
	values?: Record<string, string>;
	errors?: Record<string, string>;
};

export type FormPayload = {
	form: FormType;
};
