export interface EmissionData {
  emissions_id: number;
  emission_rate: string;
  mcu: string;
  mcu_device_id: string;
  created_at: string;
  updated_at: string;
}
export interface FactoryData {
  factory_id: number;
  factory_name: string;
  factory_location: string;
  created_at: string;
}
export interface McuData {
  id: number;
  mcu_id: string;
  status: string;
  created_at: string;
  factory: number;
}
export interface EnergyEntryData {
  data_id: number;
  energy_type: string;
  energy_amount: string;
  co2_equivalent: string;
  tea_processed_amount: string;
  created_at: string;
  updated_at: string;
  factory: number;
}
export interface FactoryEmission {
  factoryId: number;
  factoryName: string;
  totalEmission: number;
  changePercent: number;
  date?: string;
}
export interface UserType {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  factory:number;
  user_type: string;
  profile_image: string;
}