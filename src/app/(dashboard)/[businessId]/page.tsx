import { db } from "@/lib/firebase";
import { Business } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

interface DashboardProps {
    params : {businessId : string}
}

const Dashboard = async ({params} : DashboardProps) => {
    const business = (await getDoc(doc(db, "business", params.businessId))).data() as Business;
    return (
        <div>
            Overview : {business.name}
        </div>
    )
}

export default Dashboard;