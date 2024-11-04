import { DetailColumn } from "@/components/datatable/detail-column";
import { DetailClient } from "@/components/detail/client";
import { db } from "@/lib/firebase";
import { Detail } from "@/types-db";
import { format } from "date-fns";
import { collection, doc, getDocs } from "firebase/firestore";

const detailPage = async ({ params }: { params: { businessId: string } }) => {
  const detailData = (
    await getDocs(collection(doc(db, "business", params.businessId), "detail"))
  ).docs.map((doc) => doc.data()) as Detail[];

  const formattedDetail: DetailColumn[] = detailData.map((item) => ({
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
        <DetailClient data={formattedDetail} />
      </div>
    </div>
  );
};

export default detailPage;
