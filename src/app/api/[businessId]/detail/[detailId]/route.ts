import { db } from "@/lib/firebase";
import { Detail } from "@/types-db";
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
  { params }: { params: { businessId: string; detailId: string } }
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
    if (!params.detailId) {
      return new NextResponse("Detail ID is required", { status: 400 });
    }

    const businessess = await getDoc(doc(db, "business", params.businessId));

    if (businessess.exists()) {
      const businessData = businessess.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const detailRef = await getDoc(
      doc(db, "business", params.businessId, "detail", params.detailId)
    );

    if (detailRef.exists()) {
      await updateDoc(
        doc(db, "business", params.businessId, "detail", params.detailId),
        {
          ...detailRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Detail not found", { status: 400 });
    }
    const detail = (
      await getDoc(
        doc(db, "business", params.businessId, "detail", params.detailId)
      )
    ).data() as Detail;

    return NextResponse.json({ detail });
  } catch (error) {
    console.log(`Detail PATCH Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { businessId: string; detailId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    if (!params.detailId) {
      return new NextResponse("Detail ID is required", { status: 400 });
    }

    const businesses = await getDoc(doc(db, "business", params.businessId));
    if (businesses.exists()) {
      const businessData = businesses.data();
      if (businessData?.userId !== userId) {
        return new NextResponse("UnAuthorized Access", { status: 500 });
      }
    }

    const detailRef = doc(
      db,
      "business",
      params.businessId,
      "detail",
      params.detailId
    );

    await deleteDoc(detailRef);

    return NextResponse.json({ msg: "Detail Deleted" });
  } catch (error) {
    console.log(`Detail DELETE Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
