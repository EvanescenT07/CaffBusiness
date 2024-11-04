import { DetailForm } from "@/components/detail/detail-form";
import { db } from "@/lib/firebase";
import { Detail } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

const NewDetailPage = async ({
  params,
}: {
  params: { businessId: string; detailId: string };
}) => {
  const detail = (
    await getDoc(
      doc(db, "business", params.businessId, "detail", params.detailId)
    )
  ).data() as Detail;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <DetailForm initialData={detail} />
      </div>
    </div>
  );
};

export default NewDetailPage;
