"use client";

import { RegionColumn, column } from "@/components/datatable/region-column";
import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";

interface ClientRegionProps {
  data: RegionColumn[];
}

export const RegionClient = ({ data }: ClientRegionProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading
          title={`Region (${data.length})`}
          description="Add your business region"
        />
        <Button onClick={() => router.push(`/${params.businessId}/region/new`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Region
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={column} data={data} />
    </>
  );
};
