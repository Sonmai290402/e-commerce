"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { IProduct } from "@/database/product.model";

const formSchema = z.object({
  title: z.string().min(5, "Tên sản phẩm phải có ít nhất 5 ký tự"),
  slug: z.string().optional(),
  price: z.number().int().positive().optional(),
  sale_price: z.number().int().positive().optional(),
  image: z.string().optional(),
  capacity: z.string().optional(),
  chip: z.string().optional(),
  size: z.string().optional(),
  screen: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  ram: z.string().optional(),
  card: z.string().optional(),
});

const UpdateProduct = ({ data }: { data: IProduct }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiSubmitting, setUiSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title,
      slug: data?.slug,
      price: data.price,
      sale_price: data.sale_price,
      image: data.image,
      capacity: data.capacity,
      chip: data.chip,
      size: data.size,
      screen: data.screen,
      isFeatured: data.isFeatured,
      ram: data.ram,
      card: data.card,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUiSubmitting(true);

    try {
      const res = await updateProduct({
        slug: data.slug,
        updateData: {
          title: values.title,
          slug: values.slug,
          price: values.price,
          sale_price: values.sale_price,
          capacity: values.capacity,
          image: values.image,
          chip: values.chip,
          size: values.size,
          screen: values.screen,
          isFeatured: values.isFeatured,
          ram: values.ram,
          card: values.card,
        },
      });

      if (values.slug) {
        router.replace(`/manage/update`);
      }
      if (res?.success) {
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setUiSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-5 mt-5 mb-8">
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Giá sản phẩm"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dung lượng</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Dung lượng sản phẩm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chip</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="Chip" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kích thước</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Kích thước sản phẩm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="screen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Màn hình</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Kích thước màn hình"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="RAM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="card"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card đồ hoạ</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="Card đồ hoạ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sản phẩm nổi bật</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          isLoading={isSubmitting}
          variant="default"
          type="submit"
          className="mx-auto block"
          disabled={uiSubmitting}
        >
          Cập nhật sản phẩm
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProduct;
