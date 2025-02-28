"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/database/product.model";
import { SearchIcon } from "../icons";
import Image from "next/image";

// Fetcher function cho SWR
const fetchSuggestions = async (query: string) => {
  if (query.length < 2) return [];
  const res = await fetch(`/api/search?q=${query}`);
  const data = await res.json();
  return data.success ? data.data : [];
};

const Search = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: suggestions = [] } = useSWR(
    query.length >= 2 ? ["search", query] : null,
    () => fetchSuggestions(query),
    { revalidateOnFocus: false, dedupingInterval: 300 }
  );

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/${query}`);
    }
  };

  return (
    <div className="relative">
      <div className="hidden sm:flex items-center gap-3 w-150 lg:w-[400px]">
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-black rounded-full"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div
          className="bg-primary rounded-full absolute right-0 p-1 cursor-pointer -translate-x-1/3"
          onClick={handleSearch}
        >
          <SearchIcon className="size-5" />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute w-full bg-white shadow-lg mt-2 rounded-lg z-50">
          {suggestions.map((product: IProduct) => (
            <Link
              key={product._id}
              href={`/${product.categorySlug}/${product.subCategorySlug}/${product.slug}`}
            >
              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={200}
                  height={300}
                  className="size-10 object-cover rounded"
                />
                <div>
                  <p className="text-base font-semibold text-black">
                    {product.title}
                  </p>
                  <div>
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <p className="text-base text-primary">
                          {product.sale_price.toLocaleString()}đ
                        </p>
                        <p className="line-through text-base text-gray-500">
                          {product.price.toLocaleString()}đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-base text-primary">
                        {product.price.toLocaleString()}đ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
