"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CellAction } from "@/components/product/cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  quantity?: number;
  image: { url: string }[];
  isActive: string;
  category: string;
  option: string;
  detail: string;
  region: string;
  createdAt: string;
};

export const column: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isActive",
    header: "Status",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "option",
    header: "Option",
  },
  {
    accessorKey: "detail",
    header: "Detail",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
