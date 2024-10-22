import { CatalogForm } from "@/components/catalog/catalog-form";
import { db } from "@/lib/firebase";
import { Catalogs } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

const NewCatalogPage = async ({
  params,
}: {
  params: { businessId: string; catalogId: string };
}) => {
  const catalog = (
    await getDoc(
      doc(db, "business", params.businessId, "catalog", params.catalogId)
    )
  ).data() as Catalogs;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8">
          <CatalogForm initialData={catalog} />
        </div>
      </div>
    </>
  );
};

export default NewCatalogPage;
