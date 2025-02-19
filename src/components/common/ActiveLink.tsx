"use client";
import { TActiveLinkProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({ url, children }: TActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = url === pathname;
  return (
    <Link
      href={url}
      className={`p-3 rounded-md flex items-center gap-3  transition-all text-gray-500 dark:text-grayDark ${
        isActive
          ? "!text-white bg-primary svg-animate"
          : "hover:!text-primary hover:!bg-primary hover:!bg-opacity-10"
      } `}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
