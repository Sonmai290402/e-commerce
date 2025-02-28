import { getCategories } from "@/lib/actions/category.action";
import { getSubCategories } from "@/lib/actions/subCategory.action";
import { getAllProducts } from "@/lib/actions/product.action";
import Header from "@/components/layout/Header";
import Banner from "@/components/layout/Banner";
import CategoryGrid from "@/components/layout/CategoryGrid";
import FeaturedProducts from "@/components/layout/FeaturedProducts";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/layout/ProductList";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductDetails from "@/components/layout/ProductDetails";
import NotFoundPage from "../not-found";

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}) {
  const { slug } = params;

  if (!slug || slug.length === 0) {
    return {
      title: "Trang chủ - E-commerce",
      description: "Chào mừng đến với website của chúng tôi",
    };
  }

  if (slug.length === 1) {
    const category = await getCategories().then((cats) =>
      cats.find((cat) => cat.slug === slug[0])
    );
    if (!category) return { title: "Danh mục không tồn tại" };

    return {
      title: `Danh mục: ${category.title}`,
      description: `Danh mục sản phẩm ${category.title}`,
    };
  }

  if (slug.length === 2) {
    const categories = await getCategories();
    const category = categories.find((cat) => slug[0] === cat.slug);
    if (!category) return { title: "Danh mục không tồn tại" };

    const subCategories = await getSubCategories(category._id);
    const subCategory = subCategories.find((sub) => sub.slug === slug[1]);
    if (!subCategory) return { title: "Danh mục con không tồn tại" };

    return {
      title: `Danh mục: ${subCategory.title}`,
      description: `Khám phá danh mục con ${subCategory.title}`,
    };
  }

  if (slug.length === 3) {
    const categories = await getCategories();
    const category = categories.find((cat) => slug[0] === cat.slug);
    if (!category) return { title: "Danh mục không tồn tại" };

    const subCategories = await getSubCategories(category._id);
    const subCategory = subCategories.find((sub) => sub.slug === slug[1]);
    if (!subCategory) return { title: "Danh mục con không tồn tại" };

    const products = await getAllProducts();
    const product = products?.data.find(
      (prod: { slug: string }) => prod.slug === slug[2]
    );

    if (!product) return { title: "Sản phẩm không tồn tại" };

    return {
      title: product.title,
      description: `Mua ngay sản phẩm ${product.title} với giá tốt nhất!`,
    };
  }

  if (slug[0] === "cart") {
    return {
      title: "Giỏ hàng",
      description: "Xem và quản lý giỏ hàng của bạn",
    };
  }

  return { title: "Trang không tồn tại" };
}

const Page = async ({ params }: { params: { slug?: string[] } }) => {
  const { slug } = params;

  if (!slug || slug.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Banner />
        <CategoryGrid />
        <FeaturedProducts />
        <h3 className="text-3xl font-bold mx-4 sm:mx-24 text-center">
          Tất cả sản phẩm
        </h3>
        <ProductList />

        <Footer />
      </div>
    );
  }

  if (slug.length === 1) {
    const category = await getCategories().then((cats) =>
      cats.find((cat) => cat.slug === slug[0])
    );

    if (!category) return <NotFoundPage />;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumb
          categorySlug={category.slug}
          categoryTitle={category.title}
        />
        <ProductList categorySlug={category.slug} />
        <Footer />
      </div>
    );
  }

  if (slug.length === 2) {
    const categories = await getCategories();
    const category = categories.find((cat) => slug[0] === cat.slug);

    if (!category) return <NotFoundPage />;

    const subCategories = await getSubCategories(category._id);
    const subCategory = subCategories.find((sub) => sub.slug === slug[1]);

    if (!subCategory) return <NotFoundPage />;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumb
          categorySlug={category.slug}
          subCategorySlug={subCategory.slug}
          categoryTitle={category.title}
          subCategoryTitle={subCategory.title}
        />
        <ProductList subCategorySlug={subCategory.slug} />
        <Footer />
      </div>
    );
  }

  if (slug.length === 3) {
    const categories = await getCategories();
    const category = categories.find((cat) => slug[0] === cat.slug);

    if (!category) return <NotFoundPage />;

    const subCategories = await getSubCategories(category._id);
    const subCategory = subCategories.find((sub) => sub.slug === slug[1]);

    if (!subCategory) return <h1>Danh mục con không tồn tại!</h1>;

    const products = await getAllProducts();
    const product = products?.data.find(
      (prod: { slug: string }) => prod.slug === slug[2]
    );

    if (!product) return <NotFoundPage />;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumb
          categorySlug={category.slug}
          subCategorySlug={subCategory.slug}
          productSlug={product.slug}
          categoryTitle={category.title}
          subCategoryTitle={subCategory.title}
          productTitle={product.title}
        />
        <ProductDetails productSlug={product.slug} />
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NotFoundPage />
    </div>
  );
};

export default Page;
