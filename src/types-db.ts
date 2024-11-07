import { Timestamp } from "firebase/firestore";

export interface Business {
  id: string;
  name: string;
  BusinessOwner: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Catalogs {
  id: string;
  label: string;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id: string;
  catalogId: string;
  catalogLabel: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Option {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Detail {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Region {
  id: string;
  name: string;
  value: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image: { url: string }[];
  isActive: boolean;
  category: string;
  option: string; 
  detail: string;
  region: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
