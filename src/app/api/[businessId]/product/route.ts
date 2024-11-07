import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
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

    const { 
      name,
      price,
      image,
      isActive,
      category,
      option,
      detail,
      region,
     } =
      body;

    if (
      !name ||
      !price ||
      !image ||
      !category ||
      !option ||
      !detail ||
      !region
    ) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessesData = businesses.data();
      if (businessesData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const productData = {
      name,
      image,
      price,
      isActive,
      category,
      option,
      detail,
      region,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "business", params.businessId, "product"),
      productData
    );

    const id = productRef.id;

    await updateDoc(doc(db, "business", params.businessId, "product", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productData }, { status: 201 });
  } catch (error) {
    console.log(`Product POST ERROR: ${error}`);
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

    const productData = (
      await getDocs(
        collection(doc(db, "business", params.businessId), "product")
      )
    ).docs.map((doc) => doc.data()) as Product[];
    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.log(`Product GET ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
