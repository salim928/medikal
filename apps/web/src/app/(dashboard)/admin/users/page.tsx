"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loadingData ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{u.fullName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}