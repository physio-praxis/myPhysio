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
