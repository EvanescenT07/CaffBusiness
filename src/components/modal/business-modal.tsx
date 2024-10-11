"use client";

import { Modal } from "@/components/modal";
import { modalHooks } from "@/hooks/modal-hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios"
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(3, { message: "Business name must be more than 3 characters" })
})

export const StoreModal = () => {
    const hooks = modalHooks()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const response = await axios.post("/api/business", values);
            toast.success("Business created successfully");
            window.location.assign(`/${response.data.id}`);
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Create a new Business"
            description="Add a new Caff Business to your account"
            isOpen={hooks.isOpen}
            onClose={hooks.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <Input
                                    disabled={isLoading}
                                    placeholder="Your Business Name"
                                    type="text"
                                    {...field} />
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button disabled={isLoading} typeof="button" variant={"outline"} size={"sm"}>Cancel</Button>
                            <Button disabled={isLoading} typeof="submit" size={"sm"}>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}