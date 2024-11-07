"use client";

import { ProductColumn, column } from "@/components/datatable/product-column";
import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";

interface ClientProductProps {
  data: ProductColumn[];
}

export const ProductClient = ({ data }: ClientProductProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Product (${data.length})`}
          description="Add your Product"
        />
        <Button
          onClick={() => router.push(`/${params.businessId}/product/new`)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={column} data={data} />
    </>
  );
};
