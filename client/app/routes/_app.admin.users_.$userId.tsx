import { useParams, Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Chip, Spinner, Avatar, Divider, Breadcrumbs, BreadcrumbItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import type { Route } from "./+types/_app.admin.users_.$userId";
import { userContext } from "~/context";

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_superuser: boolean;
  is_banned: boolean;
  phone_number: string | null;
  profile_picture_url: string | null;
}

interface Listing {
  id: number;
  title: string;
  description: string | null;
  price_cents: number;
  status: string;
  category: string;
  condition: string;
  created_at: string;
  image_url: string | null;
}

const formatPhone = (phone: string | null) => {
    if (!phone) return "No phone";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    return phone;
  };

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) {
    throw redirect(`/login?redirectTo=${request.url}`);
  }

  if (!user.is_superuser) {
    throw redirect("/");
  }

  return { id: params.userId };
}

export default function AdminUserDetailPage({ loaderData }: Route.ComponentProps) {
  const { id: loaderUserId } = loaderData ?? {};
  const { userId = loaderUserId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [banLoading, setBanLoading] = useState(false);
  const [banError, setBanError] = useState<string | null>(null);
  const [banSuccess, setBanSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiURL}/admin/users/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiURL}/admin/users/${userId}/listings`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch user listings');
        const data = await response.json();
        setListings(data);
      } catch (err: any) {
        setListingsError(err.message || 'Failed to load user listings');
      } finally {
        setListingsLoading(false);
      }
    };
    fetchUserListings();
  }, [userId]);

  const handleBanToggle = async () => {
    if (!userId || !user) return;
    setBanLoading(true);
    setBanError(null);
    setBanSuccess(null);

    const shouldBan = !user?.is_banned;
    const apiURL = import.meta.env.VITE_API_URL;
    const endpoint = `${apiURL}/admin/users/${userId}/${shouldBan ? 'ban' : 'unban'}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${shouldBan ? 'ban' : 'unban'} user`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setBanSuccess(shouldBan ? 'User banned successfully.' : 'User reinstated successfully.');
    } catch (err: any) {
      setBanError(err.message || `Unable to ${shouldBan ? 'ban' : 'unban'} user`);
    } finally {
      setBanLoading(false);
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'sold': return 'default';
      case 'draft': return 'warning';
      case 'inactive': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto pt-8 px-4">
        <div className="flex justify-center py-20">
          <Spinner label="Loading user details..." size="lg" />
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-4 bg-red-100 text-red-600 rounded-lg">
          {error || 'User not found'}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto pt-8 px-4 pb-10">
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/admin">Admin Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/admin/users">Users</BreadcrumbItem>
        <BreadcrumbItem>{(user.first_name || user.last_name) ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : user.email}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-3xl font-bold mb-6">{user.first_name} {user.last_name}'s Details</h1>
          <Card className="mb-6 p-4">
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-start gap-6">
              <Avatar
                src={user.profile_picture_url || undefined}
                name={`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                size="lg"
                className="flex-shrink-0"
              />

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm text-gray-500 font-medium">User ID</label>
                  <p className="text-lg font-semibold">{user.id}</p>
                </div>

                <Divider />

                <div>
                  <label className="text-sm text-gray-500 font-medium">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">First Name</label>
                    <p className="text-lg">
                      {user.first_name || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium">Last Name</label>
                    <p className="text-lg">
                      {user.last_name || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                </div>

                <Divider />

                <div>
                  <label className="text-sm text-gray-500 font-medium">Phone Number</label>
                  <p className="text-lg">{formatPhone(user.phone_number)}</p>
                </div>

                <Divider />

                <div className="flex items-end gap-6">
                  <div>
                    <label className="text-sm text-gray-500 font-medium block mb-2">Account Type</label>
                    {user.is_superuser ? (
                      <Chip color="warning" variant="flat">ADMIN</Chip>
                    ) : (
                      <Chip color="default" variant="flat">USER</Chip>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 font-medium block mb-2">Account Status</label>
                    {user.is_banned ? (
                      <Chip color="danger" variant="flat">BANNED</Chip>
                    ) : (
                      <Chip color="success" variant="flat">ACTIVE</Chip>
                    )}
                  </div>

                  <Button
                    size="md"
                    radius="lg"
                    color={user.is_banned ? "success" : "danger"}
                    variant="flat"
                    onPress={handleBanToggle}
                    isLoading={banLoading}
                    className="ml-auto mr-4"
                  >
                    {user.is_banned ? "Unban User" : "Ban User"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {banError && (
                <div className="p-2 bg-red-100 text-red-600 rounded text-sm">
                  {banError}
                </div>
              )}

              {banSuccess && (
                <div className="p-2 bg-green-100 text-green-700 rounded text-sm">
                  {banSuccess}
                </div>
              )}

              <p className="text-xs text-neutral-600">
                {user.is_banned
                  ? "Unban to restore marketplace access."
                  : "Banning restricts marketplace access immediately."}
              </p>
            </div>
          </CardBody>
        </Card>


          <Card>
            <CardHeader className="flex justify-between items-center p-6">
              <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}'s Listings</h2>
              <Chip color="primary" variant="flat">{listings.length} Listings</Chip>
            </CardHeader>
            <CardBody>
              {listingsError && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{listingsError}</div>
              )}
              {listingsLoading ? (
                <div className="flex justify-center py-8"><Spinner label="Loading user listings..." /></div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">{user.first_name}  {user.last_name} has no listings yet.</div>
              ) : (
                <Table aria-label="User listings table" className="min-w-full">
                  <TableHeader>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>PRICE</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>CONDITION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>CREATED</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id} className="hover:bg-gray-50 cursor-pointer">
                        <TableCell>
                          <Link to={`/admin/listings/${listing.id}`} className="hover:underline font-medium">{listing.title}</Link>
                        </TableCell>
                        <TableCell className="font-semibold">{formatPrice(listing.price_cents)}</TableCell>
                        <TableCell className="text-center"><Chip size="sm" variant="flat" color="warning">{listing.category.replace(/_/g,' ').toUpperCase()}</Chip></TableCell>
                        <TableCell className="text-center"><Chip size="sm" variant="flat" color="primary">{listing.condition.replace(/_/g,' ').toUpperCase()}</Chip></TableCell>
                        <TableCell className="text-center"><Chip size="sm" variant="flat" color={getStatusColor(listing.status)}>{listing.status.toUpperCase()}</Chip></TableCell>
                        <TableCell className="text-sm text-gray-600">{formatDate(listing.created_at)}</TableCell>
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
