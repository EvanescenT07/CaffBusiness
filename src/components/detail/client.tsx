"use client";

import { DetailColumn, column } from "@/components/datatable/detail-column";
import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";

interface ClientDetailProps {
  data: DetailColumn[];
}

export const DetailClient = ({ data }: ClientDetailProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title={`Detail (${data.length})`}
          description="Add your Detail"
        />
        <Button onClick={() => router.push(`/${params.businessId}/detail/new`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>

      <Separator/>
      <DataTable searchKey="name" columns={column} data={data} />
    </>
  );
};
