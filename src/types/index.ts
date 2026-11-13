export interface ApiError {
  success: boolean;
  error: string;
  stack: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export interface Rental {
  _id: string;
  equipment: Equipment;
  quantity: number;
  startDate: string;
  returnDate: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface RentalInput {
  equipment: string;
  quantity: number;
  startDate: string;
  returnDate: string;
}

export interface RentalUpdate {
  equipment?: string;
  quantity?: number;
  startDate?: string;
  returnDate?: string;
}

export interface EquipmentInput {
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  isActive?: boolean;
}

export interface EquipmentUpdate {
  name?: string;
  category?: string;
  description?: string;
  quantity?: number;
  rentalRate?: number;
  isActive?: boolean;
}

export interface Equipment {
  _id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  rentalRate: number;
  isActive: boolean;
  /** Chosen illustration (see libs/equipmentIcon). */
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "admin" | "member";
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  password: string;
  role?: "admin" | "member";
}

export interface LoginInput {
  email: string;
  password: string;
}
