"use client";

import { Catalogs } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AlertDeleteModal } from "../modal/alert-delete-modal";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/ui/image-uploader";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface CatalogFormProps {
  initialData: Catalogs;
}

const formSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  imageUrl: z.string().url({ message: "Image URL is not valid" }),
});

export const CatalogForm = ({ initialData }: CatalogFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const isEditMode = Boolean(initialData);

  const title = isEditMode ? "Edit Catalog" : "Add Catalog";
  const description = isEditMode ? "Edit your catalog" : "Add your new catalog";
  const toastMessage = isEditMode
    ? "Catalog successfully updated"
    : "Catalog successfully created";
  const action = isEditMode ? "Save Changes" : "Create Catalog";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      if (isEditMode && params.catalogId) {
        await axios.patch(
          `/api/${params.businessId}/catalog/${params.catalogId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.businessId}/catalog`, data);
      }
      
      toast.success(toastMessage);
      router.push(`/${params.businessId}/catalog`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      if (!params.catalogId) return;

      const { imageUrl } = form.getValues();
  
      await deleteObject(ref(storage, imageUrl));
      await axios.delete(
        `/api/${params.businessId}/catalog/${params.catalogId}`
      );
      
      toast.success("Catalog successfully deleted");
      router.refresh();
      router.push(`/${params.businessId}/catalog`);
    } catch (error) {
      console.error("Error deleting catalog:", error);
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

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catalog Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog Name</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Catalog Name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="ml-auto"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};