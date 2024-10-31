"use client";

import { Catalogs, Category } from "@/types-db";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

interface CategoryFormProps {
  initialData: Category;
  catalogs: Catalogs[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Category Name is required" }),
  catalogId: z.string().min(1, { message: "Catalog ID is not valid" }),
});

export const CategoryForm = ({ initialData, catalogs }: CategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const isEditMode = Boolean(initialData);

  const title = isEditMode ? "Edit Category" : "Add Category";
  const description = isEditMode
    ? "Edit your category"
    : "Add your new category";
  const toastMessage = isEditMode
    ? "Category successfully updated"
    : "Category successfully created";
  const action = isEditMode ? "Save Changes" : "Create Category";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const { catalogId: formCatId } = form.getValues();
      const matchedCatalog = catalogs.find(
        (catalog) => catalog.id === formCatId
      );
      if (isEditMode && params.categoryId) {
        await axios.patch(
          `/api/${params.businessId}/categories/${params.categoryId}`,
          { ...data, catalogLabel: matchedCatalog?.label }
        );
      } else {
        await axios.post(`/api/${params.businessId}/categories`, {
          ...data,
          catalogLabel: matchedCatalog?.label,
        });
      }

      toast.success(toastMessage);
      router.push(`/${params.businessId}/categories`);
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
      if (!params.categoryId) return;
      await axios.delete(
        `/api/${params.businessId}/categories/${params.categoryId}`
      );

      toast.success("Category successfully deleted");
      router.refresh();
      router.push(`/${params.businessId}/categories`);
    } catch (error) {
      console.error("Error deleting category:", error);
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
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    disabled={isLoading}
                    placeholder="Your Category Name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catalogId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select Catalog"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {catalogs.map((catalog) => (
                        <SelectItem key={catalog.id} value={catalog.id}>
                          {catalog.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
