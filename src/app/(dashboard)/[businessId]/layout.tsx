import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { query, collection, where, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Business } from "@/types-db";
import Navbar from "@/components/navbar/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { businessId: string };
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const businessSnap = await getDocs(
    query(
      collection(db, "business"),
      where("userId", "==", userId),
      where("id", "==", params.businessId)
    )
  );

  let business: Business | undefined;

  businessSnap.forEach((doc) => {
    business = doc.data() as Business;
    return;
  });

  if (!business) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
