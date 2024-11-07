"use client";

import { Category, Detail, Option, Product, Region } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AlertDeleteModal } from "@/components/modal/alert-delete-modal";
import { Heading } from "@/components/header/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import CustomImageUploader from "@/components/ui/custom-image-uploader";

interface ProductFormProps {
  initialData: Product;
  categories: Category[];
  option: Option[];
  detail: Detail[];
  region: Region[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce.number().min(1, { message: "Price is required" }),
  image: z
    .object({ url: z.string() })
    .array()
    .min(1, { message: "Image is required" }),
  isActive: z.boolean().default(false).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  option: z.string().min(1, { message: "Option is required" }),
  detail: z.string().min(1, { message: "Detail is required" }),
  region: z.string().min(1, { message: "Region is required" }),
});

export const ProductForm = ({
  initialData,
  categories,
  option,
  detail,
  region,
}: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      image: [],
      isActive: false,
      category: "",
      option: "",
      detail: "",
      region: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const isEditMode = Boolean(initialData);

  const title = isEditMode ? "Edit Product" : "Add Product";
  const description = isEditMode ? "Edit your product" : "Add your new product";
  const toastMessage = isEditMode
    ? "Product successfully updated"
    : "Product successfully created";
  const action = isEditMode ? "Save Change" : "Create Product";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (isEditMode && params.productId) {
        await axios.patch(
          `/api/${params.businessId}/product/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.businessId}/product`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.businessId}/product`);
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      if (!params.productId) return;
      await axios.delete(
        `/api/${params.businessId}/product/${params.productId}`
      );
      router.refresh();
      router.push(`/${params.businessId}/product`);
      toast.success("Product successfully deleted");
    } catch (error) {
      console.error("Error deleting product: ", error);
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

      <div className="flex itmes-center justify-between">
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <CustomImageUploader
                    maxImage={5}
                    value={field.value.map((image) => image.url)}
                    onChange={(urls) => {
                      field.onChange(urls.map((url) => ({ url })));
                    }}
                    onRemove={(url) => {
                      field.onChange(
                        field.value.filter(
                          (currentURL) => currentURL.url !== url
                        )
                      );
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="Product Name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    disabled={isLoading}
                    placeholder="0"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="option"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option</FormLabel>
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
                          placeholder="Select a option"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {option.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
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
                          placeholder="Select a detail"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {detail.map((detail) => (
                        <SelectItem key={detail.id} value={detail.name}>
                          {detail.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
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
                          placeholder="Select a region"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {region.map((region) => (
                        <SelectItem key={region.id} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                      This Product Will be on Homescreen
                    </FormDescription>
                  </div>
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
