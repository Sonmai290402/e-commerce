import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/database/product.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const query = req.nextUrl.searchParams.get("q");

    if (!query) {
      return NextResponse.json({ success: false, data: [] });
    }

    const results = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: ["title", "category"],
            fuzzy: {}, // Hỗ trợ tìm kiếm lỗi chính tả
          },
        },
      },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          price: 1,
          sale_price: 1,
          image: 1,
          slug: 1,
          categorySlug: 1,
          subCategorySlug: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Lỗi tìm kiếm" });
  }
}
