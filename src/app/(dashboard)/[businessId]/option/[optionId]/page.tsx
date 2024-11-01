import { OptionForm } from "@/components/option/option-form";
import { db } from "@/lib/firebase";
import { Option } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

const NewOptionPage = async ({
  params,
}: {
  params: { businessId: string; optionId: string };
}) => {
  const option = (
    await getDoc(
      doc(db, "business", params.businessId, "option", params.optionId)
    )
  ).data() as Option;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <OptionForm initialData={option} />
      </div>
    </div>
  );
};

export default NewOptionPage;
