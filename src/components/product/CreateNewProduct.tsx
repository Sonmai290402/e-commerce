"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createProduct } from "@/lib/actions/product.action";
import { getCategories } from "@/lib/actions/category.action";
import { getSubCategories } from "@/lib/actions/subCategory.action";

const formSchema = z.object({
  title: z.string().min(5, "Tên sản phẩm phải có ít nhất 5 ký tự"),
  image: z.string(),
  price: z.number(),
  sale_price: z.number().optional(),
  rating: z.array(z.number()).default([5]),
  brand: z.string(),
  desc: z.string(),
  category: z.string().min(1, "Chọn danh mục sản phẩm"),
  subCategory: z.string().min(1, "Chọn danh mục con"),
  views: z.number().default(0),
});

function CreateNewProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);
  const [subCategories, setSubCategories] = useState<
    { _id: string; title: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      price: 0,
      brand: "",
      sale_price: undefined,
      desc: "",
      category: "",
      subCategory: "",
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategories(
          Array.isArray(res)
            ? res.map((cat: { _id: unknown; title?: string }) => ({
                _id: String(cat._id), // Ép kiểu về string
                title: cat.title ?? "Danh mục không tên", // Đảm bảo không undefined
              }))
            : []
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSubCategories() {
      if (!selectedCategory) {
        setSubCategories([]);
        return;
      }
      try {
        const res = await getSubCategories(selectedCategory);
        console.log("fetchSubCategories ~ res:", res);
        setSubCategories(
          Array.isArray(res)
            ? res.map((sub: { _id: unknown; title?: string }) => ({
                _id: String(sub._id),
                title: sub.title ?? "Danh mục con không tên",
              }))
            : []
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh mục con:", error);
        setSubCategories([]);
      }
    }
    fetchSubCategories();
  }, [selectedCategory]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const data = {
        ...values,
        slug: slugify(values.title, { lower: true, locale: "vi" }),
      };
      const res = await createProduct(data);
      if (!res?.success) {
        toast.error(res?.message);
        return;
      }
      toast.success("Thêm sản phẩm thành công");
      if (res?.data) {
        router.replace("/manage/product");
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-8 mt-10 mb-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm *</FormLabel>
                <FormControl>
                  <Input placeholder="Tên sản phẩm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh *</FormLabel>
                <FormControl>
                  <Input placeholder="URL hình ảnh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategory(value);
                    form.setValue("subCategory", ""); // Reset subCategory khi chọn category khác
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục con *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("subCategory", value); // Ensure subCategory is set
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục con" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Giá sản phẩm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá khuyến mãi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Giá khuyến mãi"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          isLoading={isSubmitting}
          type="submit"
          className="w-[120px]"
          disabled={isSubmitting}
        >
          Thêm sản phẩm
        </Button>
      </form>
    </Form>
  );
}

export default CreateNewProduct;
