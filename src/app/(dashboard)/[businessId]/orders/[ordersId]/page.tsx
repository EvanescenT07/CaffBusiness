import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

const NewOrderPage = async (
  request: Request,
  { params }: { params: { businessId: string; ordersId: string } }
) => {
    const orderData = (
      await getDoc(
        doc(db, "business", params.businessId, "order", params.ordersId)
      )
    ).data() as Order;
};

export default NewOrderPage;
