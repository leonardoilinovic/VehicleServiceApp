export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId?: number;
}

  
  export interface Client {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  }
  
  export interface ServiceTask {
    id: number;
    description: string;
    cost: number;
  }
  
  export interface ServiceRecord {
    id: number;
    serviceDate: string;
    totalCost: number;
    vehicleId: number;
    tasks: ServiceTask[];
  }
  