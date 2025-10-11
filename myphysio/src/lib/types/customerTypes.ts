export type CustomerSearchItem = {
	customer: {
		customerId: number;
		createdAt: Date;
		name: string | null;
		email: string | null;
		phoneNumber: string | null;
		address: string | null;
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
	name: string | null;
	email: string | null;
	phoneNumber: string | null;
	address: string | null;
	hasConsent: boolean;
	consentFilename: string | null;
	consentUploadedAt: string | null;
	pets?: CustomerPet[];
	last5Treatments?: CustomerPetTreatment[];
};
