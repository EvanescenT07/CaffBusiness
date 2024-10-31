import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
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

    const { name, catalogLabel, catalogId } = body;

    if (!name || !catalogId) {
      return new NextResponse("Name and Catalog ID are Missing", {
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

    const categoryData = {
      name,
      catalogId,
      catalogLabel,
      createdAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "business", params.businessId, "categories"),
      categoryData
    );

    const id = categoryRef.id;

    await updateDoc(doc(db, "business", params.businessId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...categoryData });
  } catch (error) {
    console.log(`Category POST ERROR: ${error}`);
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
    const categoriesData = (
      await getDocs(
        collection(doc(db, "business", params.businessId), "categories")
      )
    ).docs.map((doc) => doc.data()) as Category[];
    return NextResponse.json(categoriesData);
  } catch (error) {
    console.log(`Category GET ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
