import { UserButton } from "@clerk/nextjs";
import MainNav from "@/components/navbar/main-nav";
import { BusinessSwitcher } from "@/components/navbar/business-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Business } from "@/types-db";

const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in")
    }

    const businessSnap = await getDocs(
        query(collection(db, "business"),
        where("userId", "==", userId))
    )

    const businesses = [] as Business[];
    
    businessSnap.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() } as Business)
    })

    return(
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <BusinessSwitcher items={businesses} />
                <MainNav />
                <div className="ml-auto items-center">
                    <UserButton showName afterSwitchSessionUrl="/" />
                </div>
            </div>
        </div>
    )
}

export default Navbar;


