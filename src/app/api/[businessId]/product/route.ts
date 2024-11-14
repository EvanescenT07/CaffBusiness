import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

    const { name, price, image, isActive, category, option, detail, region } =
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

    const url = new URL(request.url);
    const productParams = url.searchParams;

    const productRef = collection(
      doc(db, "business", params.businessId),
      "product"
    );

    let productQuery;

    const queryConst = [];

    if (productParams.has("option")) {
      queryConst.push(where("option", "==", productParams.get("option")));
    }

    if (productParams.has("categories")) {
      queryConst.push(where("categories", "==", productParams.get("categories")));
    }

    if (productParams.has("detail")) {
      queryConst.push(where("detail", "==", productParams.get("detail")));
    }

    if (productParams.has("region")) {
      queryConst.push(where("region", "==", productParams.get("region")));
    }

    if (productParams.has("isActive")) {
      queryConst.push(
        where(
          "isActive",
          "==",
          productParams.get("isActive") === "true" ? true : false
        )
      );
    }

    if (queryConst.length > 0) {
      productQuery = query(productRef, and(...queryConst));
    } else productQuery = query(productRef);

    const querySnapshot = await getDocs(productQuery);

    const productData: Product[] = querySnapshot.docs.map(
      (doc) => doc.data() as Product
    );

    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.log(`Product GET ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
