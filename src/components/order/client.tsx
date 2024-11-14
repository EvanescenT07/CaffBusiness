"use client";

import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";
import { OrderColumn, columns } from "@/components/datatable/order-column";

interface ClientOrderProps {
  data: OrderColumn[];
}

export const OrderClient = ({ data }: ClientOrderProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title={`Order (${data.length})`}
          description="Add your Order"
        />
        <Button onClick={() => router.push(`/${params.businessId}/orders/new`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" data={data} columns={columns} />
    </>
  );
};
