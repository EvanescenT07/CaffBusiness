import { OrderColumn } from "@/components/datatable/order-column";
import { OrderClient } from "@/components/order/client";
import { db } from "@/lib/firebase";
import { formatter } from "@/lib/utils";
import { Order } from "@/types-db";
import { collection, doc } from "@firebase/firestore";
import { format } from "date-fns";
import { getDocs } from "firebase/firestore";

const OrderPage = async (
  request: Request,
  { params }: { params: { businessId: string } }
) => {
  const orderData = (
    await getDocs(collection(doc(db, "business", params.businessId), "order"))
  ).docs.map((doc) => doc.data()) as Order[];

  const formattedOrder: OrderColumn[] = orderData.map((item) => ({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    address: item.address,
    product: item.orderItems.map((item) => item.name).join(", "),
    order_status: item.order_status,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        if (item && item.quantity !== undefined) {
          return total + Number(item.quantity * item.price);
        } else {
          return total;
        }
      }, 0)
    ),
    images: item.orderItems.map((item) => item.image[0].url),
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrder} />
      </div>
    </div>
  );
};

export default OrderPage;
