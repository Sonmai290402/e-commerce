import { menuItems } from "@/constants";
import { TMenuItem } from "@/types";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ActiveLink from "../common/ActiveLink";

const Sidebar = () => {
  return (
    <div className="p-5 border-r border-r-gray-200 dark:border-opacity-10 bg-white h-screen flex flex-col dark:bg-grayDarker">
      <Link href="/" className="logo cursor-pointer mb-5">
        <span className="font-bold text-3xl text-primary">LOGO</span>
      </Link>
      <ul>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            url={item.url}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-end gap-5">
        <UserButton />
      </div>
    </div>
  );
};

function MenuItem({ url = "/", title = "", icon }: TMenuItem) {
  return (
    <li>
      <ActiveLink url={url}>
        {icon} {title}
      </ActiveLink>
    </li>
  );
}

export default Sidebar;
