import { RegionColumn } from "@/components/datatable/region-column";
import { db } from "@/lib/firebase";
import { Region } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { RegionClient } from "@/components/region/client";

const regionPage = async ({ params }: { params: { businessId: string } }) => {
  const regionData = (
    await getDocs(collection(doc(db, "business", params.businessId), "region"))
  ).docs.map((doc) => doc.data()) as Region[];

  const formattedRegion: RegionColumn[] = regionData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <RegionClient data={formattedRegion} />
        </div>
    </div>
  )
};

export default regionPage;
