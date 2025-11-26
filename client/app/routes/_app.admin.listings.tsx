import { Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, SelectItem, Select } from "@heroui/react";
import { useEffect, useState } from "react";
import type { Route } from "./+types/_app.admin.listings";
import { userContext } from "~/context";

interface Listing {
  id: number;
  title: string;
  description: string | null;
  price_cents: number;
  status: string;
  category: string;
  condition: string;
  created_at: string;
  seller: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
  };
}

type SortField = 'price' | 'created_at' | 'updated_at';
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

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('created_at');
  const [order, setOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    let cancelled = false;
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const perPage = 100;
        let page = 1;
        const aggregated: Listing[] = [];
        while (true) {
          const url = `${apiURL}/listings?page_num=${page}&card_num=${perPage}&sort_by=${sortBy}&order=${order}`;
          const res = await fetch(url, { credentials: 'include' });
          if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            throw new Error(msg.detail || `Error ${res.status}`);
          }
            const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) {
            break;
          }
          aggregated.push(...data);
          if (data.length < perPage) {
            break;
          }
          page += 1;
          if (page > 500) {
            break;
          }
        }
        if (!cancelled) setListings(aggregated);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load listings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAllListings();
    return () => { cancelled = true; };
  }, [sortBy, order]);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

   const formatPhone = (phone: string | null) => {
    if (!phone) return "No phone";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'sold': return 'default';
      case 'draft': return 'warning';
      case 'inactive': return 'danger';
      default: return 'default';
    }
  };

  return (
    <main className="max-w-7xl mx-auto pt-8 px-4 pb-10">
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/admin">Admin Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Listing Management</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Listing Management</h1>

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
            <SelectItem key="price">Price</SelectItem>
            <SelectItem key="created_at">Created</SelectItem>
            <SelectItem key="updated_at">Updated</SelectItem>
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
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Listings</h2>
          <Chip color="primary" variant="flat">
            {listings.length} Total Listings
          </Chip>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner label="Loading listings..." />
            </div>
          ) : (
            <Table aria-label="Listings table" className="min-w-full">
              <TableHeader>
                <TableColumn className="text-center">TITLE</TableColumn>
                <TableColumn className="text-center">PRICE</TableColumn>
                <TableColumn className="text-center">SELLER</TableColumn>
                <TableColumn className="text-center">PHONE</TableColumn>
                <TableColumn className="text-center">CATEGORY</TableColumn>
                <TableColumn className="text-center">CONDITION</TableColumn>
                <TableColumn className="text-center">STATUS</TableColumn>
                <TableColumn className="text-center">CREATED</TableColumn>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow 
                    key={listing.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell className="text-left">
                      <Link 
                        to={`/admin/listings/${listing.id}`}
                        className="hover:underline font-medium"
                      >
                        {listing.title}
                      </Link>
                    </TableCell>
                    <TableCell className="font-semibold text-center">
                      {formatPrice(listing.price_cents)}
                    </TableCell>
                    <TableCell className="text-center">
                      {(listing.seller.first_name || listing.seller.last_name) ? (
                        <span className="font-medium">{`${listing.seller.first_name || ''} ${listing.seller.last_name || ''}`.trim()}</span>
                      ) : (
                        <span className="text-gray-400 italic">No name</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {listing.seller.phone_number ? (
                        formatPhone(listing.seller.phone_number)
                      ) : (
                        <span className="text-gray-400 italic">No phone</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip size="sm" variant="flat" color="warning">
                        {listing.category.replace(/_/g, ' ').toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip size="sm" variant="flat" color="primary">
                        {listing.condition.replace(/_/g, ' ').toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip size="sm" variant="flat" color={getStatusColor(listing.status)}>
                        {listing.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-center">
                      {formatDate(listing.created_at)}
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
