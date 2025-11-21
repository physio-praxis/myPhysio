import type { Crumb } from './navigationTypes';

export type FormType = {
	values?: Record<string, string>;
	errors?: Record<string, string>;
};

export type FormPayload = {
	breadCrumb: Crumb[];
	form: FormType;
};
