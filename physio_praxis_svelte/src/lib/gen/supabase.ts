export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			allowed_users: {
				Row: {
					email: string;
					username: string | null;
				};
				Insert: {
					email: string;
					username?: string | null;
				};
				Update: {
					email?: string;
					username?: string | null;
				};
				Relationships: [];
			};
			appointed_treatment: {
				Row: {
					appointment_id: number | null;
					invoice_id: number | null;
					pet_treatment_id: number;
					treatment_id: number | null;
				};
				Insert: {
					appointment_id?: number | null;
					invoice_id?: number | null;
					pet_treatment_id?: number;
					treatment_id?: number | null;
				};
				Update: {
					appointment_id?: number | null;
					invoice_id?: number | null;
					pet_treatment_id?: number;
					treatment_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'pet_treatment_invoice_id_fkey';
						columns: ['invoice_id'];
						isOneToOne: false;
						referencedRelation: 'invoice';
						referencedColumns: ['invoice_id'];
					},
					{
						foreignKeyName: 'pet_treatment_treatment_id_fkey';
						columns: ['treatment_id'];
						isOneToOne: false;
						referencedRelation: 'treatment';
						referencedColumns: ['treatment_id'];
					},
					{
						foreignKeyName: 'public_appointed_treatment_appointment_id_fkey';
						columns: ['appointment_id'];
						isOneToOne: false;
						referencedRelation: 'appointment';
						referencedColumns: ['appointment_id'];
					}
				];
			};
			appointment: {
				Row: {
					appointment_id: number;
					customer_id: number | null;
					date_time: string | null;
					desc: string | null;
					pet_id: number | null;
					status_id: number | null;
				};
				Insert: {
					appointment_id?: number;
					customer_id?: number | null;
					date_time?: string | null;
					desc?: string | null;
					pet_id?: number | null;
					status_id?: number | null;
				};
				Update: {
					appointment_id?: number;
					customer_id?: number | null;
					date_time?: string | null;
					desc?: string | null;
					pet_id?: number | null;
					status_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'appointment_customer_id_fkey';
						columns: ['customer_id'];
						isOneToOne: false;
						referencedRelation: 'customer';
						referencedColumns: ['customer_id'];
					},
					{
						foreignKeyName: 'appointment_pet_id_fkey';
						columns: ['pet_id'];
						isOneToOne: false;
						referencedRelation: 'pet';
						referencedColumns: ['pet_id'];
					},
					{
						foreignKeyName: 'appointment_status_id_fkey';
						columns: ['status_id'];
						isOneToOne: false;
						referencedRelation: 'appointment_status';
						referencedColumns: ['status_id'];
					}
				];
			};
			appointment_status: {
				Row: {
					status_id: number;
					status_name: string | null;
				};
				Insert: {
					status_id?: number;
					status_name?: string | null;
				};
				Update: {
					status_id?: number;
					status_name?: string | null;
				};
				Relationships: [];
			};
			customer: {
				Row: {
					address: string | null;
					customer_id: number;
					email: string | null;
					name: string | null;
					phone_number: string | null;
				};
				Insert: {
					address?: string | null;
					customer_id?: number;
					email?: string | null;
					name?: string | null;
					phone_number?: string | null;
				};
				Update: {
					address?: string | null;
					customer_id?: number;
					email?: string | null;
					name?: string | null;
					phone_number?: string | null;
				};
				Relationships: [];
			};
			invoice: {
				Row: {
					amount: number | null;
					customer_id: number | null;
					date_issued: string | null;
					invoice_id: number;
				};
				Insert: {
					amount?: number | null;
					customer_id?: number | null;
					date_issued?: string | null;
					invoice_id?: number;
				};
				Update: {
					amount?: number | null;
					customer_id?: number | null;
					date_issued?: string | null;
					invoice_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'invoice_customer_id_fkey';
						columns: ['customer_id'];
						isOneToOne: false;
						referencedRelation: 'customer';
						referencedColumns: ['customer_id'];
					}
				];
			};
			medical_issue: {
				Row: {
					medical_issue: string | null;
					medical_issue_id: number;
				};
				Insert: {
					medical_issue?: string | null;
					medical_issue_id?: number;
				};
				Update: {
					medical_issue?: string | null;
					medical_issue_id?: number;
				};
				Relationships: [];
			};
			payment: {
				Row: {
					amount_paid: number | null;
					invoice_id: number | null;
					payment_date: string | null;
					payment_id: number;
				};
				Insert: {
					amount_paid?: number | null;
					invoice_id?: number | null;
					payment_date?: string | null;
					payment_id?: number;
				};
				Update: {
					amount_paid?: number | null;
					invoice_id?: number | null;
					payment_date?: string | null;
					payment_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'payment_invoice_id_fkey';
						columns: ['invoice_id'];
						isOneToOne: false;
						referencedRelation: 'invoice';
						referencedColumns: ['invoice_id'];
					}
				];
			};
			pet: {
				Row: {
					age: string | null;
					breed: string | null;
					customer_id: number | null;
					medical_history: string | null;
					name: string | null;
					pet_id: number;
					species_id: number | null;
				};
				Insert: {
					age?: string | null;
					breed?: string | null;
					customer_id?: number | null;
					medical_history?: string | null;
					name?: string | null;
					pet_id?: number;
					species_id?: number | null;
				};
				Update: {
					age?: string | null;
					breed?: string | null;
					customer_id?: number | null;
					medical_history?: string | null;
					name?: string | null;
					pet_id?: number;
					species_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'pet_customer_id_fkey';
						columns: ['customer_id'];
						isOneToOne: false;
						referencedRelation: 'customer';
						referencedColumns: ['customer_id'];
					},
					{
						foreignKeyName: 'pet_species_id_fkey';
						columns: ['species_id'];
						isOneToOne: false;
						referencedRelation: 'species';
						referencedColumns: ['species_id'];
					}
				];
			};
			pet_medical_issue: {
				Row: {
					medical_issue_id: number | null;
					pet_id: number | null;
					pet_medical_issue_id: number;
					state: string | null;
				};
				Insert: {
					medical_issue_id?: number | null;
					pet_id?: number | null;
					pet_medical_issue_id?: number;
					state?: string | null;
				};
				Update: {
					medical_issue_id?: number | null;
					pet_id?: number | null;
					pet_medical_issue_id?: number;
					state?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'pet_medical_issue_medical_issue_id_fkey';
						columns: ['medical_issue_id'];
						isOneToOne: false;
						referencedRelation: 'medical_issue';
						referencedColumns: ['medical_issue_id'];
					},
					{
						foreignKeyName: 'pet_medical_issue_pet_id_fkey';
						columns: ['pet_id'];
						isOneToOne: false;
						referencedRelation: 'pet';
						referencedColumns: ['pet_id'];
					}
				];
			};
			product: {
				Row: {
					description: string | null;
					name: string | null;
					pricing: number | null;
					product_id: number;
				};
				Insert: {
					description?: string | null;
					name?: string | null;
					pricing?: number | null;
					product_id?: number;
				};
				Update: {
					description?: string | null;
					name?: string | null;
					pricing?: number | null;
					product_id?: number;
				};
				Relationships: [];
			};
			product_purchase: {
				Row: {
					amount: number | null;
					customer_id: number | null;
					invoice_id: number | null;
					name: string | null;
					pricing: number | null;
					product_id: number | null;
					purchase_id: number;
				};
				Insert: {
					amount?: number | null;
					customer_id?: number | null;
					invoice_id?: number | null;
					name?: string | null;
					pricing?: number | null;
					product_id?: number | null;
					purchase_id?: number;
				};
				Update: {
					amount?: number | null;
					customer_id?: number | null;
					invoice_id?: number | null;
					name?: string | null;
					pricing?: number | null;
					product_id?: number | null;
					purchase_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'product_purchase_customer_id_fkey';
						columns: ['customer_id'];
						isOneToOne: false;
						referencedRelation: 'customer';
						referencedColumns: ['customer_id'];
					},
					{
						foreignKeyName: 'product_purchase_invoice_id_fkey';
						columns: ['invoice_id'];
						isOneToOne: false;
						referencedRelation: 'invoice';
						referencedColumns: ['invoice_id'];
					},
					{
						foreignKeyName: 'product_purchase_product_id_fkey';
						columns: ['product_id'];
						isOneToOne: false;
						referencedRelation: 'product';
						referencedColumns: ['product_id'];
					}
				];
			};
			species: {
				Row: {
					name: string | null;
					species_id: number;
				};
				Insert: {
					name?: string | null;
					species_id?: number;
				};
				Update: {
					name?: string | null;
					species_id?: number;
				};
				Relationships: [];
			};
			treatment: {
				Row: {
					description: string | null;
					name: string | null;
					treatment_id: number;
				};
				Insert: {
					description?: string | null;
					name?: string | null;
					treatment_id?: number;
				};
				Update: {
					description?: string | null;
					name?: string | null;
					treatment_id?: number;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
				Database['public']['Views'])
		? (Database['public']['Tables'] &
				Database['public']['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
		? Database['public']['Enums'][PublicEnumNameOrOptions]
		: never;
