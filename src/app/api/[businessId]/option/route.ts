import { db } from "@/lib/firebase";
import { Option } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await request.json();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    const { name, value } = body;

    if (!name || !value) {
      return new NextResponse("Name and Value are missing", {
        status: 400,
      });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const optionData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const optionRef = await addDoc(
      collection(db, "business", params.businessId, "option"),
      optionData
    );

    const id = optionRef.id;

    await updateDoc(doc(db, "business", params.businessId, "option", id), {
      ...optionData,
      id,
      updateaAt: serverTimestamp(),
    });
    return NextResponse.json({ id, ...optionData });
  } catch (error) {
    console.log(`Option POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  request: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }
    const optionData = (
      await getDocs(
        collection(doc(db, "business", params.businessId), "option")
      )
    ).docs.map((doc) => doc.data()) as Option[];
    return NextResponse.json(optionData);
  } catch (error) {
    console.log(`Option GET ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
