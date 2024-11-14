"use client";

import { Region } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AlertDeleteModal } from "@/components/modal/alert-delete-modal";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RegionFormProps {
  initialData: Region;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Region Name is required" }),
  value: z.string().min(1, { message: "Value Name is required" }),
});

export const RegionForm = ({ initialData }: RegionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const isEditMode = Boolean(initialData);

  const title = isEditMode ? "Edit Region" : "Add Region";
  const description = isEditMode ? "Edit your Region" : "Add your new Region";
  const toastMessage = isEditMode
    ? "Region successfully updated"
    : "Region successfully created";
  const action = isEditMode ? "Save Changes" : "Create Region";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (isEditMode && params.regionId) {
        await axios.patch(
          `/api/${params.businessId}/region/${params.regionId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.businessId}/region`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.businessId}/region`);
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh()
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      if (!params.regionId) return;
      await axios.delete(`/api/${params.businessId}/region/${params.regionId}`);
      toast.success("Region successfully deleted");
      router.refresh();
      router.push(`/${params.businessId}/region`);
    } catch (error) {
      console.error("Error deleting region ", error);
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
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isEditMode && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
                  <FormLabel>Region Name</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Region name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region Value</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Region value"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
