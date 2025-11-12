export type CustomerSearchItem = {
	customer: {
		customerId: number;
		createdAt: Date;
		firstName: string | null;
		lastName: string | null;
		email: string | null;
		phoneNumber: string | null;
		street: string | null;
		additionalAddress: string | null;
		postalCode: string | null;
		city: string | null;
		country: string | null;
	};
	petsLine: string;
	badges: { hasConcent: boolean };
};

export type CustomerSearchResponse = {
	items: CustomerSearchItem[];
	nextCursor?: string;
};

export type CustomerPet = {
	petId: number;
	name: string | null;
	speciesId: number | null;
	species: string | null;
	breed: string | null;
	birthdate: string | null;
	age: string | null;
	medicalHistory: string | null;
};

export type CustomerPetTreatment = {
	petTreatmentId: number;
	createdAt: string;
	petId: number;
	petName: string | null;
	treatmentId: number;
	treatmentName: string;
	invoiceId: number | null;
	invoiceAmount: string | null;
	invoiceDate: string | null;
};

export type CustomerDetails = {
	customerId: number;
	createdAt: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	phoneNumber: string | null;
	street: string | null;
	additionalAddress: string | null;
	postalCode: string | null;
	city: string | null;
	country: string | null;
	hasConsent: boolean;
	consentFilename: string | null;
	consentUploadedAt: string | null;
	pets?: CustomerPet[];
	last5Treatments?: CustomerPetTreatment[];
};

export type UpdateCustomerInput = {
	customerId: number;
	firstName: string;
	lastName: string;
	email?: string | null;
	phoneNumber?: string | null;
	street: string | null;
	additionalAddress: string | null;
	postalCode: string | null;
	city: string | null;
	country: string | null;
};
