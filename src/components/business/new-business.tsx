"use client"

import { PlusCircle } from "lucide-react"

interface CreateNewBusinessItemProps{
    onClick : () => void
}

export const CreateNewBusinessItem = ({onClick} : CreateNewBusinessItemProps) => {
    return(
        <div onClick={onClick} className="text-sm flex items-center bg-gray-50 px-2 py-1 cursor-pointer text-muted-foreground hover:text-color-primary">
            <PlusCircle className="mr-2 h-5 w-5"/>
            Add New Business
        </div>
    )
}