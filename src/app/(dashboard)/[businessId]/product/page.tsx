import { ProductColumn } from "@/components/datatable/product-column";
import { ProductClient } from "@/components/product/client";
import { db } from "@/lib/firebase";
import { formatter } from "@/lib/utils";
import { Product } from "@/types-db";
import { format } from "date-fns";
import { collection, doc, getDocs } from "firebase/firestore";

const productPage = async ({ params }: { params: { businessId: string } }) => {
  const productData = (
    await getDocs(collection(doc(db, "business", params.businessId), "product"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProduct: ProductColumn[] = productData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    quantity: item.quantity,
    image: item.image,
    isActive: item.isActive === false ? "Inactive" : "Active",
    category: item.category,
    option: item.option,
    detail: item.detail,
    region: item.region,
    images: item.image,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProduct} />
      </div>
    </div>
  )
};

export default productPage;
