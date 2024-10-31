import { Category } from "@/types-db";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  request: Request,
  { params }: { params: { businessId: string; categoryId: string } }
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
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));

    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const categoryRef = await getDoc(
      doc(db, "business", params.businessId, "categories", params.categoryId)
    );

    if (categoryRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "categories", params.categoryId),
        {
          ...categoryRef.data(),
          name,
          catalogLabel,
          catalogId,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Category not found", { status: 404 });
    }

    const category = (
      await getDoc(
        doc(db, "business", params.businessId, "catalog", params.categoryId)
      )
    ).data() as Category;

    return NextResponse.json({ category });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Catalog ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const categoryRef = doc(
      db,
      "business",
      params.businessId,
      "categories",
      params.categoryId
    );

    await deleteDoc(categoryRef);

    return NextResponse.json({ message: "Category Deleted" });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
