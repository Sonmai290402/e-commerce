import Banner from "@/components/layout/Banner";
import CategoryGrid from "@/components/layout/CategoryGrid";
import Header from "@/components/layout/Header";

export default async function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <CategoryGrid />
    </div>
  );
}
