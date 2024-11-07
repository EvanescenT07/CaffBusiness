import { ProductForm } from "@/components/product/product-form";
import { db } from "@/lib/firebase";
import { Category, Detail, Option, Product, Region } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const NewProductPage = async ({
  params,
}: {
  params: { businessId: string; productId: string };
}) => {
  const productData = (
    await getDoc(
      doc(db, "business", params.businessId, "product", params.productId)
    )
  ).data() as Product;

  const categoryData = (
    await getDocs(
      collection(doc(db, "business", params.businessId), "categories")
    )
  ).docs.map((doc) => doc.data()) as Category[];

  const optionData = (
    await getDocs(collection(doc(db, "business", params.businessId), "option"))
  ).docs.map((doc) => doc.data()) as Option[];

  const detailData = (
    await getDocs(collection(doc(db, "business", params.businessId), "detail"))
  ).docs.map((doc) => doc.data()) as Detail[];

  const regionData = (
    await getDocs(collection(doc(db, "business", params.businessId), "region"))
  ).docs.map((doc) => doc.data()) as Region[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={productData}
          categories={categoryData}
          option={optionData}
          detail={detailData}
          region={regionData}
        />
      </div>
    </div>
  );
};

export default NewProductPage;
