import { LeftArrow } from "@/components/icons";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-7xl">404</h1>
      <h2 className="mb-5">This page could not be found</h2>
      <Link
        className="flex gap-3 justify-center items-center hover:text-blue-600"
        href="/"
      >
        <LeftArrow className="size-5" />
        <span>Return to homepage</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
