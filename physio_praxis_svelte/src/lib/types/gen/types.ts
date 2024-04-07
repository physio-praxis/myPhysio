export interface PetOverview {
	pet_name: string;
	pet_species: string;
	pet_breed: string;
	pet_age: number;
	pet_medical_history: string;
}

export interface CustomerPetOverview {
	customer_id: number;
	customer_name: string;
	email: string;
	phone_number: string;
	address: string;
	pets: PetOverview[];
}
