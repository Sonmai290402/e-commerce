import Banner from "@/components/layout/Banner";
import Header from "@/components/layout/Header";
import createUser from "@/lib/actions/user.action";

export default async function Home() {
  return (
    <div>
      <Header />
      <Banner />
    </div>
  );
}
