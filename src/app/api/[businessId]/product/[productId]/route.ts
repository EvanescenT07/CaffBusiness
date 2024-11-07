import { db, storage } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  request: Request,
  { params }: { params: { businessId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await request.json();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    const { name, isActive, image, price, category, option, detail, region } =
      body;

    if (
      !name ||
      !image ||
      !price ||
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

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));

    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const productRef = await getDoc(
      doc(db, "business", params.businessId, "product", params.productId)
    );

    if (productRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "product", params.productId),
        {
          ...productRef.data(),
          name,
          image,
          price,
          isActive,
          category,
          option,
          detail,
          region,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Product not found", { status: 404 });
    }

    const products = (
      await getDoc(
        doc(db, "business", params.businessId, "product", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(
      { message: "Product updated successfully", products },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Product POST Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const productRef = doc(
      db,
      "business",
      params.businessId,
      "product",
      params.productId
    );

    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const images = productDoc.data()?.image;

    if (!images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        })
      );
    }

    await deleteDoc(productRef);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Product DELETE Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  request: Request,
  { params }: { params: { businessId: string; productId: string } }
) => {
  try {
    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = (
      await getDoc(
        doc(db, "business", params.businessId, "product", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(
      { message: "Product fetched successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Product GET Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
