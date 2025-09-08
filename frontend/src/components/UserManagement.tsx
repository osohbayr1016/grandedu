"use client";

import { useState } from "react";
import Modal from "./Modal";

interface User {
  id: string;
  userCode: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserManagementProps {
  users: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userFilter: "all" | "starred" | "admin" | "user";
  onFilterChange: (filter: "all" | "starred" | "admin" | "user") => void;
  userSortBy: "name" | "id" | "date";
  onSortChange: (sort: "name" | "id" | "date") => void;
  onToggleHighlight: (user: User) => void;
  onDeleteUser: (user: User) => void;
  showUserModal: boolean;
  onCloseUserModal: () => void;
  onSaveNewAdmin: (adminData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => Promise<void>;
  newAdminForm: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  };
  onNewAdminFormChange: (field: string, value: string) => void;
  saving: boolean;
}

export default function UserManagement({
  users,
  searchQuery,
  onSearchChange,
  userFilter,
  onFilterChange,
  userSortBy,
  onSortChange,
  onToggleHighlight,
  onDeleteUser,
  showUserModal,
  onCloseUserModal,
  onSaveNewAdmin,
  newAdminForm,
  onNewAdminFormChange,
  saving,
}: UserManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (userFilter === "starred") return user.isHighlighted && matchesSearch;
    if (userFilter === "admin") return user.role === "admin" && matchesSearch;
    if (userFilter === "user") return user.role === "user" && matchesSearch;
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (userSortBy === "name") {
      return `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`
      );
    }
    if (userSortBy === "id") {
      return (a.userCode || "").localeCompare(b.userCode || "");
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDeleteConfirm = (user: User) => {
    setShowDeleteConfirm(user);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDeleteUser(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Хэрэглэгч хайх..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "starred", "admin", "user"].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  onFilterChange(filter as "all" | "starred" | "admin" | "user")
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter === "all" && "Бүгд"}
                {filter === "starred" && "Онцолсон"}
                {filter === "admin" && "Админ"}
                {filter === "user" && "Хэрэглэгч"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["name", "id", "date"].map((sort) => (
              <button
                key={sort}
                onClick={() => onSortChange(sort as "name" | "id" | "date")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userSortBy === sort
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sort === "name" && "Нэрээр"}
                {sort === "id" && "ID-аар"}
                {sort === "date" && "Огноогоор"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хэрэглэгч
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Эрх
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                          {user.isHighlighted && (
                            <span className="ml-2 text-yellow-500">⭐</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleHighlight(user)}
                        className={`px-2 py-1 rounded text-xs ${
                          user.isHighlighted
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isHighlighted ? "Онцолсон" : "Онцлох"}
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Admin Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={onCloseUserModal}
        title="Шинэ админ нэмэх"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveNewAdmin(newAdminForm);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Нэр *
              </label>
              <input
                type="text"
                required
                value={newAdminForm.firstName}
                onChange={(e) =>
                  onNewAdminFormChange("firstName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Овог *
              </label>
              <input
                type="text"
                required
                value={newAdminForm.lastName}
                onChange={(e) =>
                  onNewAdminFormChange("lastName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имэйл *
            </label>
            <input
              type="email"
              required
              value={newAdminForm.email}
              onChange={(e) => onNewAdminFormChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Нууц үг *
            </label>
            <input
              type="password"
              required
              value={newAdminForm.password}
              onChange={(e) => onNewAdminFormChange("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Утасны дугаар
            </label>
            <input
              type="tel"
              value={newAdminForm.phoneNumber}
              onChange={(e) =>
                onNewAdminFormChange("phoneNumber", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCloseUserModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Хадгалж байна..." : "Нэмэх"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Хэрэглэгч устгах"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Та &quot;{showDeleteConfirm?.firstName}{" "}
            {showDeleteConfirm?.lastName}&quot; хэрэглэгчийг устгахдаа итгэлтэй
            байна уу?
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Цуцлах
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Устгах
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
