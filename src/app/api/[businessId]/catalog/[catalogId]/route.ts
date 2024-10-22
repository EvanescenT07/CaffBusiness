import { Catalogs } from "@/types-db";
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
  { params }: { params: { businessId: string; catalogId: string } }
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

    if (!params.catalogId) {
      return new NextResponse("Catalog ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));

    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const catalogRef = await getDoc(
      doc(db, "business", params.businessId, "catalog", params.catalogId)
    );

    if (catalogRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "catalog", params.catalogId),
        {
          ...catalogRef.data(),
          label,
          imageUrl,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Catalog not found", { status: 404 });
    }

    const catalogs = (
      await getDoc(
        doc(db, "business", params.businessId, "catalog", params.catalogId)
      )
    ).data() as Catalogs;

    return NextResponse.json({ catalogs });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; catalogId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.catalogId) {
      return new NextResponse("Catalog ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const catalogRef = doc(
      db,
      "business",
      params.businessId,
      "catalog",
      params.catalogId
    );

    await deleteDoc(catalogRef);

    return NextResponse.json({ message: "Catalog Deleted" });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
