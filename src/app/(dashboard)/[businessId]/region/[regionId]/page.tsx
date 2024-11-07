import { RegionForm } from "@/components/region/region-form";
import { db } from "@/lib/firebase";
import { Region } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

const NewRegionPage = async ({
  params,
}: {
  params: { businessId: string; regionId: string };
}) => {
  const region = (
    await getDoc(
      doc(db, "business", params.businessId, "region", params.regionId)
    )
  ).data() as Region;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <RegionForm initialData={region} />
      </div>
    </div>
  );
};

export default NewRegionPage;
