"use client";

import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/datatable/data-table";
import { CatalogColumn, columns } from "@/components/datatable/column";

interface ClientCatalogProps {
  data: CatalogColumn[];
}

export const ClientCatalog = ({ data }: ClientCatalogProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Catalog (${data.length})`}
          description="Manage your Business Catalog"
        />
        <Button
          onClick={() => router.push(`/${params.businessId}/catalog/new`)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
