"use client";

import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";
import { CategoryColumn, column } from "@/components/datatable/category-column";

interface ClientCategoryProps {
  data: CategoryColumn[];
}

export const ClientCategory = ({ data }: ClientCategoryProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage your Business Category"
        />
        <Button
          onClick={() => router.push(`/${params.businessId}/categories/new`)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Categories
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={column} data={data} />
    </>
  );
};
