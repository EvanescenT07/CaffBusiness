import { Timestamp } from "firebase/firestore";

export interface Business {
  id: string;
  name: string;
  BusinessOwner: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Catalogs {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
