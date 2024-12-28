import React from "react";
import Link from "next/link";

interface SideNavProps {
  links: { label: string; href: string; icon: React.ReactNode }[];
}

const SideNav: React.FC<SideNavProps> = ({ links }) => {
  return (
    <div className="h-full flex flex-col w-[240px] shadow-md">
      <div className="flex items-center justify-between p-4 border-b-2">
        <h2 className="text-xl font-[500]">Admin Dashboard </h2>
      </div>
      <div className="flex flex-col mt-2">
        {links.map((link) => (
          <div key={link.label}>
            <Link
              href={link.href}
              className="flex items-center py-3 px-6 hover:bg-gray-200 text-lg"
            >
              {link.icon}
              <span className="ml-4">{link.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
