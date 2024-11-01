import { db } from "@/lib/firebase";
import { Option } from "@/types-db";
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
  { params }: { params: { businessId: string; optionId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await request.json();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    const { name, value } = body;

    if (!name || !value) {
      return new NextResponse("Name and Value are Missing", {
        status: 400,
      });
    }
    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }
    if (!params.optionId) {
      return new NextResponse("Option ID is required", { status: 400 });
    }

    const businessess = await getDoc(doc(db, "business", params.businessId));

    if (businessess.exists()) {
      const businessData = businessess.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const optionRef = await getDoc(
      doc(db, "business", params.businessId, "option", params.optionId)
    );

    if (optionRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "option", params.optionId),
        {
          ...optionRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Option not found", { status: 400 });
    }
    const option = (
      await getDoc(
        doc(db, "business", params.businessId, "option", params.optionId)
      )
    ).data() as Option;

    return NextResponse.json({ option });
  } catch (error) {
    console.log(`Option PATCH ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; optionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.optionId) {
      return new NextResponse("Option ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const optionRef = doc(
      db,
      "business",
      params.businessId,
      "option",
      params.optionId
    );

    await deleteDoc(optionRef);
  } catch (error) {
    console.log(`Opton DELETE ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
