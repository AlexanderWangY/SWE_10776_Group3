import { useParams, Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Chip, Spinner, Avatar, Divider, Breadcrumbs, BreadcrumbItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import type { Route } from "./+types/_app.admin.users_.$userId";
import { userContext } from "~/context";

{/* USER INTERFACES */}
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

{/* LISTING INTERFACE */}
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

{/* FORMATS PHONE NUMBER OR RETURNS FALLBACK */}
const formatPhone = (phone: string | null) => {
    if (!phone) return "No phone";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    return phone;
  };

{/* AUTHENTICATION CHECK */}
export async function loader({ params, context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  {/* AUTHENTICATION CHECK */}
  if (!user) {
    throw redirect(`/login?redirectTo=${request.url}`);
  }

  {/* ADMIN CHECK */}
  if (!user.is_superuser) {
    throw redirect("/");
  }

  return { id: params.userId };
}

{/* USER DETAIL COMPONENT */}
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
  const apiURL = import.meta.env.VITE_API_URL;

  {/* EXTRACTS ERROR MESSAGE FROM RESPONSE */}
  const extractErrorMessage = useCallback(async (response: Response, fallback: string) => {
    try {
      const contentType = response.headers.get("content-type") || "";

      {/* HANDLES JSON RESPONSE */}
      if (contentType.includes("application/json")) {
        const body = await response.json();
        const detail = body?.detail ?? body?.message ?? body;

        {/* HANDLES STRING ERROR DETAIL */}
        if (typeof detail === "string") {
          return detail;
        }

        {/* HANDLES ARRAY OF ERROR DETAILS */}
        if (Array.isArray(detail)) {
          return detail
            .map((item) =>
              typeof item === "string"
                ? item
                : typeof item === "object"
                ? JSON.stringify(item)
                : String(item)
            )
            .join("\n");
        }

        {/* HANDLES OBJECT ERROR DETAIL */}
        if (typeof detail === "object" && detail !== null) {
          if ("message" in detail && typeof detail.message === "string") {
            return detail.message;
          }
          return JSON.stringify(detail);
        }
      } else {
        const text = await response.text();
        if (text) {
          return text;
        }
      }
    } catch (parseError) {
    }

    return fallback;
  }, []);

  {/* LOAD USER DATA */}
  const loadUser = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    {/* FETCH USER DATA */}
    try {
      const response = await fetch(`${apiURL}/admin/users/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [apiURL, userId]);

  {/* LOAD USER LISTINGS */}
  const loadListings = useCallback(async () => {
    if (!userId) return;
    setListingsLoading(true);
    setListingsError(null);

    {/* FETCH USER LISTINGS */}
    try {
      const response = await fetch(`${apiURL}/admin/users/${userId}/listings`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (err: any) {
      setListingsError(err?.message || "Failed to load user listings");
    } finally {
      setListingsLoading(false);
    }
  }, [apiURL, userId]);

  {/* INITIAL DATA LOAD */}
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  {/* INITIAL LISTINGS LOAD */}
  useEffect(() => {
    loadListings();
  }, [loadListings]);

  {/* HANDLES BAN/UNBAN TOGGLE */}
  const handleBanToggle = async () => {
    if (!userId || !user) return;
    setBanLoading(true);
    setBanError(null);
    setBanSuccess(null);

    {/* DETERMINE BAN OR UNBAN ACTION */}
    const shouldBan = !user?.is_banned;
    const statusEndpoint = `${apiURL}/admin/users/${userId}/${shouldBan ? "ban" : "unban"}`;
    const listingsEndpoint = `${apiURL}/admin/users/${userId}/${shouldBan ? "deactivate_listings" : "activate_listings"}`;

    {/* PERFORM BAN/UNBAN ACTION */}
    try {
      const response = await fetch(statusEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = await extractErrorMessage(
          response,
          `Failed to ${shouldBan ? "ban" : "unban"} user.`
        );
        throw new Error(message);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);

      {/* UPDATE USER LISTINGS STATUS */}
      const listingsResponse = await fetch(listingsEndpoint, {
        method: "POST",
        credentials: "include",
      });

      {/* CHECK LISTINGS UPDATE RESPONSE */}
      if (!listingsResponse.ok) {
        const message = await extractErrorMessage(
          listingsResponse,
          `${shouldBan ? "User banned" : "User unbanned"}, but listing update failed.`
        );
        throw new Error(message);
      }

      {/* RELOAD LISTINGS AFTER STATUS UPDATE */}
      await loadListings();

      {/* SET SUCCESS MESSAGE */}
      setBanSuccess(
        shouldBan
          ? "User banned and listings deactivated successfully."
          : "User reinstated and listings reactivated successfully."
      );
    } catch (err: any) {
      setBanError(err?.message || `Unable to ${shouldBan ? "ban" : "unban"} user`);
    } finally {
      setBanLoading(false);
    }
  };

  {/* FORMATTING HELPERS */}
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

  {/* RENDER LOADING STATE */}
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto pt-8 px-4">
        <div className="flex justify-center py-20">
          <Spinner label="Loading user details..." size="lg" />
        </div>
      </main>
    );
  }

  {/* RENDER ERROR STATE */}
  if (error || !user) {
    return (
      <main className="max-w-4xl mx-auto pt-8 px-4">
        <div className="p-4 bg-red-100 text-red-600 rounded-lg">
          {error || 'User not found'}
        </div>
      </main>
    );
  }

  {/* RENDER USER DETAILS */}
  return (
    <main className="max-w-4xl mx-auto pt-8 px-4 pb-10">
      {/* USER BREADCRUMBS */}
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/admin">Admin Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/admin/users">Users</BreadcrumbItem>
        <BreadcrumbItem>{(user.first_name || user.last_name) ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : user.email}</BreadcrumbItem>
      </Breadcrumbs>

      {/* USER NAME HEADER */}
      <h1 className="text-3xl font-bold mb-6">{user.first_name} {user.last_name}'s Details</h1>
        {/* PROFILE INFORMATION CARD */}
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

                <div >
                  <label className="text-sm text-gray-500 font-medium">Phone Number</label>
                  <p className="text-lg">{formatPhone(user.phone_number)}</p>
                </div>

                <Divider />

                {/* ACCOUNT TYPE */}
                <div className="flex items-end gap-6">
                  <div>
                    <label className="text-sm text-gray-500 font-medium block mb-2">Account Type</label>
                    {user.is_superuser ? (
                      <Chip color="warning" variant="flat">ADMIN</Chip>
                    ) : (
                      <Chip color="default" variant="flat">USER</Chip>
                    )}
                  </div>

                  {/* ACCOUNT STATUS */}
                  <div>
                    <label className="text-sm text-gray-500 font-medium block mb-2">Account Status</label>
                    {user.is_banned ? (
                      <Chip color="danger" variant="flat">BANNED</Chip>
                    ) : (
                      <Chip color="success" variant="flat">ACTIVE</Chip>
                    )}
                  </div>

                  {/* BAN/UNBAN BUTTON */}
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


          {/* USER LISTINGS */}
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
