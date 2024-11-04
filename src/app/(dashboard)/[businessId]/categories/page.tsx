import { ClientCategory } from "@/components/category/client";
import { CategoryColumn } from "@/components/datatable/category-column";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";

const CategoriesPage = async ({
  params,
}: {
  params: { businessId: string };
}) => {
  const categoriesData = (
    await getDocs(
      collection(doc(db, "business", params.businessId), "categories")
    )
  ).docs.map((doc) => doc.data()) as Category[];

  const formattedCategory: CategoryColumn[] = categoriesData.map((item) => ({
    id: item.id,
    name: item.name,
    catalogLabel: item.catalogLabel,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <ClientCategory data={formattedCategory} />
      </div>
    </div>
  );
};

export default CategoriesPage;
