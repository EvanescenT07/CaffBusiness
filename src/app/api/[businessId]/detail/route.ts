import { db } from "@/lib/firebase";
import { Detail } from "@/types-db";
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

    const { name, value } = body;

    if (!name || !value) {
      return new NextResponse("Name and Value are missing", { status: 400 });
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

    const detailData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    const detailRef = await addDoc(
      collection(db, "business", params.businessId, "detail"),
      detailData
    );

    const id = detailRef.id;

    await updateDoc(doc(db, "business", params.businessId, "detail", id), {
      ...detailData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...detailData });
  } catch (error) {
    console.log(`Detail POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  request: Request,
  { params }: { params: { businessId: string } }
) => {
    try {
        if (!params.businessId) {
            return new NextResponse("Business ID is required", { status: 400});
        }

        const detailData = (
            await getDocs(
                collection(doc(db, "business", params.businessId), "detail")
            )
        ).docs.map((doc) => doc.data() as Detail[]);
        return NextResponse.json(detailData);
    } catch (error) {
        console.log(`Detail GET Error: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500});
    }
};
