import { db } from "@/lib/firebase";
import { Catalogs } from "@/types-db";
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

    const { label, imageUrl } = body;

    if (!label || !imageUrl) {
      return new NextResponse("Label and Image URL are Missing", {
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

    const catalogData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
    };

    const catalogRef = await addDoc(
      collection(db, "business", params.businessId, "catalog"),
      catalogData
    );

    const id = catalogRef.id;

    await updateDoc(doc(db, "business", params.businessId, "catalog", id), {
      ...catalogData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...catalogData });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
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
    const catalogData = (await getDocs(
      collection(doc(db, "business", params.businessId), "catalog")
    )).docs.map((doc) => doc.data()) as Catalogs[];
    return NextResponse.json(catalogData)
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
