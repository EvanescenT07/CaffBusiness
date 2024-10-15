"use client";

import { Business } from "@/types-db";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertDeleteModal } from "@/components/modal/alert-delete-modal";
import { ApiComponent } from "@/components/api/api-component";

interface SettingFormProps {
  initialData: Business;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Business name must be more than 3 characters" }),
});

export const SettingForm = ({ initialData }: SettingFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/business/${params.businessId}`,
        data
      );
      toast.success("Business successfully updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/business/${params.businessId}`);
      toast.success("Business successfully deleted");
      router.refresh();
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertDeleteModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading
          title="Setting"
          description="Manage your Business preferences"
        />
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Business Name"
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-x-2 flex items-center  w-full">
            <Button
              disabled={isLoading}
              typeof="button"
              variant={"outline"}
              size={"sm"}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} typeof="submit" size={"sm"}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

      <Separator />
      <ApiComponent title="testing" description="testing description" variant="public" />
    </>
  );
};