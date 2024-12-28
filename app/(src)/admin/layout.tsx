import SideNav from "@/app/ui/admin/sidenav";
import { BiHome, BiUser } from "react-icons/bi";
import { BsShop } from "react-icons/bs";

const sidebarItems = [
  { label: "Home", href: "/admin", icon: <BiHome /> },
  { label: "Users", href: "/admin/users", icon: <BiUser /> },
  { label: "Services", href: "/admin/services", icon: <BsShop /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="h-full text-black bg-white ">
        <SideNav links={sidebarItems} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 text-black">
        {children}
      </div>
    </div>
  );
}
