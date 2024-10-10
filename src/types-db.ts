import { Timestamp } from "firebase/firestore";

export interface Business {
    id: string,
    name: string,
    userId: string,
    createdAt: Timestamp,
    updatedAt: Timestamp
}