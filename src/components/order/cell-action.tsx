import { OrderColumn } from "@/components/datatable/order-column";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDeleteModal } from "@/components/modal/alert-delete-modal";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVerticalIcon, Trash } from "lucide-react";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const  [isOpen, setIsOpen] = useState(false);

  const onCopy = (id : string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard");
  }

  const onEdit = () => {
    router.push(`/${params.businessId}/order/${data.id}`);
  }

  const onDelete = async () => {
    try {
        setIsLoading(true)
        await axios.delete(`/api/${params.businessId}/order/${data.id}`)
        router.refresh()
        router.push(`/${params.businessId}/order`)
        toast.success("Order deleted")
    } catch (error) {
        console.error("Error deleting order: ", error)
        toast.error("Something went wrong")
    } finally {
        setIsLoading(false)
        setIsOpen(false)
        router.refresh()
    }
  }

  return (
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
};
