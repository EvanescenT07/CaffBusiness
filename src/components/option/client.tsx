"use client";

import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OptionColumm, column } from "@/components/datatable/option-column";
import { DataTable } from "@/components/datatable/data-table";

interface ClientOptionProps {
    data: OptionColumm[];
}

export const OptionClient= ( {data} : ClientOptionProps) => {
    const params = useParams()
    const router = useRouter()

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Option (${data.length})`}
                    description="Add your Option"
                />
                <Button
                    onClick={() => router.push(`/${params.businessId}/option/new`)}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Option
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={column} data={data} />
        </>
    )
}
