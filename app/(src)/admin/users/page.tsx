"use client";

import AddUserModal from "@/app/ui/admin/users/addUserModal";
import SearchUsers from "@/app/ui/admin/users/searchUser";
import { useState } from "react";

export default function Page() {
  const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  const handleOpenAddUserModal = () => {
    setOpenAddUserModal(true);
  };

  return (
    <div>
      <div className="flex gap-4">
        <h1 className="text-2xl">Manage Users</h1>
        <button
          onClick={handleOpenAddUserModal}
          className="py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
        >
          Add
        </button>
      </div>
      <AddUserModal
        isOpen={openAddUserModal}
        onClose={handleCloseAddUserModal}
      />
      <div className="mt-4">
        <SearchUsers />
      </div>
    </div>
  );
}
