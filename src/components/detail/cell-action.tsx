"use client";

import { DetailColumn } from "@/components/datatable/detail-column";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDeleteModal } from "../modal/alert-delete-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Copy, Edit, MoreVerticalIcon, Trash } from "lucide-react";

interface CellActionProps {
    data: DetailColumn
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Detail ID copied to clipboard");
    };

    const onEdit = () => {
        router.push(`/${params.businessId}/detail/${data.id}`)
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.businessId}/detail/${data.id}`);
            router.refresh();
            router.push(`/${params.businessId}/detail`);
            toast.success("Detail deleted");
        } catch (error) {
            console.error("Error deleting option: ", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
            router.refresh();
        }
    };

    return(
        <>
            <AlertDeleteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit()}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </>
    )
}