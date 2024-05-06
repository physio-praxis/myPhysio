// DB ---

import type { Database } from './gen/supabase';

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

export type CustomerInsert = Database['public']['Tables']['customer']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customer']['Update'];
export type Customer = Database['public']['Tables']['customer']['Row'];

// Meta data ---
export interface IOpenGraphTag {
	title: string;
	description: string;
	image?: string;
	url?: string;
}

export interface ITwitterCardTag {
	title: string;
	description: string;
	image?: string;
	Card?: string;
}

export interface IHeadTags {
	title: string;
	description: string;
	viewport?: string;
	charset?: string;
	icon?: string;
	ogTag?: IOpenGraphTag;
	tcTag?: ITwitterCardTag;
}
