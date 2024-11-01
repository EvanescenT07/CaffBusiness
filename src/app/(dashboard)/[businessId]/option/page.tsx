import { OptionColumm } from "@/components/datatable/option-column";
import { OptionClient } from "@/components/option/client";
import { db } from "@/lib/firebase";
import { Option } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

const optionPage = async ({params} : {params: {businessId: string}}) => {
    const optionData = (
        await getDocs(
          collection(doc(db, "business", params.businessId), "option")
        )
      ).docs.map((doc) => doc.data()) as Option[];
    
      const formattedOption: OptionColumm[] = optionData.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: item.createdAt
          ? format(item.createdAt.toDate(), "MMMM do, yyyy")
          : "",
      }));

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OptionClient data={formattedOption} />
            </div>
        </div>
    )
}

export default optionPage;