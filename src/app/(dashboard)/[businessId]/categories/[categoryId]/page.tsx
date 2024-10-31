import { CategoryForm } from "@/components/category/category-form";
import { db } from "@/lib/firebase";
import { Catalogs, Category } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const NewCategoryPage = async ({
  params,
}: {
  params: { businessId: string; categoryId: string };
}) => {
  const category = (
    await getDoc(
      doc(db, "business", params.businessId, "categories", params.categoryId)
    )
  ).data() as Category;

  const catalogsData = (
    await getDocs(collection(doc(db, "business", params.businessId), "catalog"))
  ).docs.map((doc) => doc.data()) as Catalogs[];
  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8">
          <CategoryForm initialData={category} catalogs={catalogsData} />
        </div>
      </div>
    </>
  );
};

export default NewCategoryPage;
