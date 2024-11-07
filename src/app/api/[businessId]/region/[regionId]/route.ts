import { db } from "@/lib/firebase";
import { Region } from "@/types-db";
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
  { params }: { params: { businessId: string; regionId: string } }
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
    if (!params.regionId) {
      return new NextResponse("Region ID is required", { status: 400 });
    }

    const businessess = await getDoc(doc(db, "business", params.businessId));

    if (businessess.exists()) {
      const businessData = businessess.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const regionRef = await getDoc(
      doc(db, "business", params.businessId, "region", params.regionId)
    );

    if (regionRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "region", params.regionId),
        {
          ...regionRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Region not found", { status: 400 });
    }

    const region = (
      await getDoc(
        doc(db, "business", params.businessId, "region", params.regionId)
      )
    ).data() as Region;
    return NextResponse.json({ region });
  } catch (error) {
    console.log(`Region PATCH Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; regionId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }
    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }
    if (!params.regionId) {
      return new NextResponse("Region ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }
    const regionRef = doc(
      db,
      "business",
      params.businessId,
      "region",
      params.regionId
    );

    await deleteDoc(regionRef);
    return NextResponse.json({ msg: "Region Deleted" });
  } catch (error) {
    console.log(`Region DELETE Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
