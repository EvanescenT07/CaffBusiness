import { ClientCatalog } from "@/components/catalog/client-catalog";
import { CatalogColumn } from "@/components/datatable/column";
import { db } from "@/lib/firebase";
import { Catalogs } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns"

const CatalogPage = async ({ params }: { params: { businessId: string } }) => {
  const catalogsData = (await getDocs(
    collection(doc(db, "business", params.businessId), "catalog")
  )).docs.map((doc) => doc.data()) as Catalogs[];

  const formatedCatalog: CatalogColumn[] = catalogsData.map(item => ({
    id: item.id,
    label: item.label,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt ? format(item.createdAt.toDate(), "MMMM do, yyyy") : "",
  }))
    
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6">
        <ClientCatalog data={formatedCatalog} />
      </div>
    </div>
  );
};

export default CatalogPage;
