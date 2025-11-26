import { Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import type { Route } from "./+types/_app.admin.users";
import { userContext } from "~/context";

interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_verified: boolean;
  is_banned: boolean;
  phone_number: string | null;
}

type SortField = 'first_name' | 'last_name' | 'phone_number' | 'email';
type SortOrder = 'asc' | 'desc';

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) {
    throw redirect(`/login?redirectTo=${request.url}`);
  }

  if (!user.is_superuser) {
    throw redirect("/");
  }

  return null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('first_name');
  const [order, setOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiURL}/admin/users?sort_by=${sortBy}&order=${order}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [sortBy, order]);

  const formatPhone = (phone: string | null) => {
    if (!phone) return "No phone";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  return (
    <main className="max-w-7xl mx-auto pt-8 px-4 pb-10">
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/admin">Admin Dashboard</BreadcrumbItem>
        <BreadcrumbItem>User Management</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Sorting Controls */}
      <div className="mb-6 p-4 rounded-xl bg-default-50 border border-default-100 flex flex-wrap gap-6 items-center">
        
        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm text-default-700">Sort by</span>
          <Select 
            size="sm"
            variant="flat"
            selectedKeys={[sortBy]}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="w-40"
          >
            <SelectItem key="first_name">First Name</SelectItem>
            <SelectItem key="last_name">Last Name</SelectItem>
            <SelectItem key="email">Email</SelectItem>
            <SelectItem key="phone_number">Phone</SelectItem>
          </Select>
        </div>

        {/* Order */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm text-default-700">Order</span>
          
          <ButtonGroup size="sm" variant="flat" radius="md">
            <Button
              color={order === "asc" ? "primary" : "default"}
              onClick={() => setOrder("asc")}
            >
              ↑ Asc
            </Button>
            <Button
              color={order === "desc" ? "primary" : "default"}
              onClick={() => setOrder("desc")}
            >
              ↓ Desc
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <Card className="p-4">
        <CardHeader className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          <Chip color="primary" variant="flat">
            {users.length} Total Users
          </Chip>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner label="Loading users..." />
            </div>
          ) : (
            <Table aria-label="Users table" className="min-w-full">
              <TableHeader>
                <TableColumn className="text-center">FIRST NAME</TableColumn>
                <TableColumn className="text-center">LAST NAME</TableColumn>
                <TableColumn className="text-center">EMAIL</TableColumn>
                <TableColumn className="text-center">PHONE</TableColumn>
                <TableColumn className="text-center">VERIFIED</TableColumn>
                <TableColumn className="text-center">BANNED</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell className="text-center">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="hover:underline"
                      >
                        {user.first_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="hover:underline"
                      >
                        {user.last_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="hover:underline"
                      >
                        {user.email}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPhone(user.phone_number)}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.is_verified ? (
                        <Chip color="warning" size="sm" variant="flat">YES</Chip>
                      ) : (
                        <Chip color="default" size="sm" variant="flat">NO</Chip>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.is_banned ? (
                        <Chip color="danger" size="sm" variant="flat">BANNED</Chip>
                      ) : (
                        <Chip color="success" size="sm" variant="flat">ACTIVE</Chip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </main>
  );
}
