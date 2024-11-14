"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface OrderFormProps {

}

const formSchema = z.object({

})

export const OrderForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: 
    })
}

const [isLoading, setIsLoading] = useState(false)
const [isOpen, setIsOpen] = useState(false)
const params = useParams()
const router = useRouter()