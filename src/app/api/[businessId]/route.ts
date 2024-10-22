import { db } from "@/lib/firebase";
import { Business } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  reqs: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await reqs.json();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Business Name is Missing", { status: 400 });
    }

    const dbRef = doc(db, "business", params.businessId);
    await updateDoc(dbRef, { name });

    const business = (await getDoc(dbRef)).data() as Business;

    return NextResponse.json(business);
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  reqs: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const dbRef = doc(db, "business", params.businessId);

    await deleteDoc(dbRef);

    return NextResponse.json({ message: "Business Deleted", status: 200 });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
