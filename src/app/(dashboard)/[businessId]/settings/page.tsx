import { SettingForm } from "@/components/setting/setting-form";
import { db } from "@/lib/firebase";
import { Business } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

interface SettingPageProps {
  params: {
    businessId: string;
  };
}

const SettingPage = async ({ params }: SettingPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const business = (
    await getDoc(doc(db, "business", params.businessId))
  ).data() as Business;

  if (!business || business.userId !== userId) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-5 p-5 ">
        <SettingForm initialData={business} />
      </div>
    </div>
  );
};

export default SettingPage;
