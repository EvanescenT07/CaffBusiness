"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "@/components/order/cell-action";
import { CellImage } from "@/components/order/cell-image";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  product: string;
  totalPrice: string;
  images: string[];
  isPaid: boolean;
  order_status: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "images",
        header: "Images",
        cell: ({row}) => (
          <div className="grid grid-cols-2 gap-2">
            <CellImage data={row.original.images} />
          </div>
        )
    },
    {
      accessorKey: "phone",
      header: "Phone"
    },
    {
      accessorKey: "address",
      header: "Address"
    },
    {
      accessorKey: "totalPrice",
      header: "Amount"
    },
    {
      accessorKey: "isPaid",
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      id: "action",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
]
