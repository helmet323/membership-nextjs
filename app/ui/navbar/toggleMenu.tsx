// components/ToggleMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

interface ToggleMenuProps {
  settings: { name: string; link: string }[];
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({ settings }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !buttonRef.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50">
      <button
        ref={buttonRef}
        className="cursor-pointer p-3 rounded-full hover:bg-[rgba(0,0,0,0.1)] transition-all duration-200"
        onClick={handleClick}
      >
        <FaUserCircle size={24} />
      </button>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 bg-white rounded-md shadow-md"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="py-2">
            {settings.map((setting) => (
              <div key={setting.name}>
                <Link
                  href={setting.link}
                  className="block px-6 py-2 text-sm hover:bg-gray-100 text-black transition-all duration-150"
                  onClick={handleClose}
                >
                  {setting.name}
                </Link>
              </div>
            ))}
            <div
              className="block px-6 py-2 text-sm hover:bg-gray-100 text-black transition-all duration-150 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ToggleMenu;
