import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import React from "react";
import { Business } from "@/types-db";

interface SetLayoutProps {
  children: React.ReactNode;
}

const SetLayout = async ({ children }: SetLayoutProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const businessSnap = await getDocs(
    query(collection(db, "business"), where("userId", "==", userId))
  );

  let business = null as any;

  businessSnap.forEach((doc) => {
    business = doc.data() as Business;
    return;
  });

  if (business) {
    redirect(`/${business.id}`);
  }

  return <div>{children}</div>;
};

export default SetLayout;
