import { db, storage } from "@/lib/firebase";
import { Business } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  reqs: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await reqs.json();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Business Name is Missing", { status: 400 });
    }

    const dbRef = doc(db, "business", params.businessId);
    await updateDoc(dbRef, { name });

    const business = (await getDoc(dbRef)).data() as Business;

    return NextResponse.json(business);
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  reqs: Request,
  { params }: { params: { businessId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!params.businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    const dbRef = doc(db, "business", params.businessId);

    const catalogCollection = await getDocs(
      collection(db, `business/${params.businessId}/catalog`)
    );
    catalogCollection.forEach(async (catalogDoc) => {
      await deleteDoc(catalogDoc.ref);
      const catalogImageURL = catalogDoc.data().imageUrl;
      if (catalogImageURL) {
        const imageRef = ref(storage, catalogImageURL);
        await deleteObject(imageRef);
      }
    });

    const categoriesCollection = await getDocs(
      collection(db, `business/${params.businessId}/categories`)
    );
    categoriesCollection.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    const optionsCollection = await getDocs(
      collection(db, `business/${params.businessId}/option`)
    );
    optionsCollection.forEach(async (optionDoc) => {
      await deleteDoc(optionDoc.ref);
    });

    const detailsCollection = await getDocs(
      collection(db, `business/${params.businessId}/detail`)
    );
    detailsCollection.forEach(async (detailDoc) => {
      await deleteDoc(detailDoc.ref);
    });

    const regionsCollection = await getDocs(
      collection(db, `business/${params.businessId}/region`)
    );
    regionsCollection.forEach(async (regionDoc) => {
      await deleteDoc(regionDoc.ref);
    });

    const productsCollection = await getDocs(
      collection(db, `business/${params.businessId}/product`)
    );
    productsCollection.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);
      const imagesProduct = productDoc.data().image;
      if (imagesProduct && Array.isArray(imagesProduct)) {
        await Promise.all(
          imagesProduct.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });

    const ordersCollection = await getDocs(
      collection(db, `business/${params.businessId}/orders`)
    );
    ordersCollection.forEach(async (ordersDoc) => {
      await deleteDoc(ordersDoc.ref);
      const ordersItemArray = ordersDoc.data().orderItems;
      if (ordersItemArray && Array.isArray(ordersItemArray)) {
        await Promise.all(
          ordersItemArray.map(async (orderItem) => {
            const itemImagesArray = orderItem.images;
            if (itemImagesArray && Array.isArray(itemImagesArray)) {
              await Promise.all(
                itemImagesArray.map(async (itemImage) => {
                  const itemImageRef = ref(storage, itemImage.url);
                  await deleteObject(itemImageRef);
                })
              );
            }
          })
        );
      }
    });

    await deleteDoc(dbRef);

    return NextResponse.json({ message: "Business Deleted", status: 200 });
  } catch (error) {
    console.log(`Business POST ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
