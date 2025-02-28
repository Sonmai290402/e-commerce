import { IProduct } from "@/database/product.model";

type TActiveLinkProps = {
  url: string;
  children: React.ReactNode;
};

type TMenuItem = {
  url: string;
  title: string;
  icon?: React.ReactNode;
};

type TCreateUserParams = {
  clerkId: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
};

type TCreateProductParams = {
  category: string;
  subCategory: string;
  title: string;
  slug: string;
};
type TUpdateProductParams = {
  slug: string;
  updateData: Partial<IProduct>;
};

type TCategoryItemProps = {
  title: string;
  image: string;
  slug: string;
  categorySlug?: string;
  isSubCategory: boolean;
};

type TFeaturedProductProps = {
  subCategorySlug: string;
  categorySlug: string;
  title: string;
  image: string;
  slug: string;
  price: number;
  sale_price: number;
  category_id: string;
  subCategory: string;
  _id: string;
};
type TProductProps = {
  subCategorySlug: string;
  categorySlug: string;
  title: string;
  image: string;
  slug: string;
  price: number;
  sale_price: number;
  _id: string;
  capacity: string;
  chip: string;
  size: string;
  screen: string;
  rating: number[];
  views: number;
  ram: string;
  card: string;
};

type TCartItem = {
  _id: string;
  name: string;
  price: number;
  sale_price: number;
  quantity: number;
  categorySlug: string;
  subCategorySlug: string;
  productSlug: string;
};

export {
  TCreateUserParams,
  TActiveLinkProps,
  TMenuItem,
  TCreateProductParams,
  TCategoryItemProps,
  TUpdateProductParams,
  TFeaturedProductProps,
  TProductProps,
  TCartItem,
};
