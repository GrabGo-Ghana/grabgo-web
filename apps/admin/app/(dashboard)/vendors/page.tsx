/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Input,
    Button,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@grabgo/ui";
import { Search, Filter, Download, Plus, Star, Shop, Xmark, CheckCircleSolid } from "iconoir-react";
import { type Vendor } from "../../../lib/mockData";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

import { RegisterVendorDialog } from "./RegisterVendorDialog";

export default function VendorsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "food" | "grocery" | "pharmacy" | "market">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed" | "busy" | "under_review">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [totalVendors, setTotalVendors] = useState(0);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchVendors = async () => {
            setIsInitialLoading(true);
            try {
                let mappedType = "";
                if (typeFilter === "food") mappedType = "restaurant";
                else if (typeFilter === "grocery") mappedType = "grocery";
                else if (typeFilter === "pharmacy") mappedType = "pharmacy";
                else if (typeFilter === "market") mappedType = "grabmart";

                let mappedStatus = "";
                if (statusFilter === "under_review") mappedStatus = "pending";
                else if (statusFilter === "open") mappedStatus = "approved";
                else if (statusFilter === "closed") mappedStatus = "suspended";

                const response = await apiClient.get(
                    `/admin/vendors?page=${currentPage}&limit=${itemsPerPage}&type=${mappedType}&status=${mappedStatus}&q=${searchQuery}`
                );

                if (isMounted && response.data.success) {
                    const fetchedVendors = response.data.data.vendors.map((v: any) => {
                        let uiType: "food" | "grocery" | "pharmacy" | "market" = "food";
                        if (v.type === "restaurant") uiType = "food";
                        else if (v.type === "grocery") uiType = "grocery";
                        else if (v.type === "pharmacy") uiType = "pharmacy";
                        else if (v.type === "grabmart") uiType = "market";

                        let uiStatus: "open" | "closed" | "busy" | "under_review" | "suspended" = "open";
                        if (v.status === "pending") uiStatus = "under_review";
                        else if (v.status === "approved") uiStatus = "open";
                        else if (v.status === "suspended") uiStatus = "closed";
                        else if (v.status === "rejected") uiStatus = "closed";

                        return {
                            id: v.id,
                            name: v.name,
                            type: uiType,
                            ownerName: v.ownerName,
                            email: v.email,
                            phone: v.phone,
                            address: "",
                            status: uiStatus,
                            rating: v.rating,
                            totalRevenue: v.totalSales,
                            orderCount: v.totalOrders,
                            isVerified: v.applicationStatus === "approved",
                            isFeatured: false,
                            createdAt: v.createdAt,
                            logo: v.logo || undefined
                        };
                    });

                    setVendors(fetchedVendors);
                    setTotalVendors(response.data.data.total);
                }
            } catch (error) {
                console.error("Failed to fetch vendors:", error);
            } finally {
                if (isMounted) {
                    setIsInitialLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchVendors();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, itemsPerPage, typeFilter, statusFilter, searchQuery]);

    const handleRegisterSuccess = (newVendor: Vendor) => {
        setVendors((prev) => [newVendor, ...prev]);
        setTypeFilter("all");
        setStatusFilter("all");
        setSearchQuery("");
    };

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalVendors / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + vendors.length, totalVendors);
    const paginatedVendors = vendors;

    const activeFilterCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

    const getStatusBadge = (status: Vendor["status"]) => {
        switch (status) {
            case "open": return <Badge variant="success">Open</Badge>;
            case "busy": return <Badge variant="warning">Busy</Badge>;
            case "closed": return <Badge variant="destructive">Closed</Badge>;
            case "under_review": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-transparent dark:bg-amber-500/20 dark:text-amber-400">Under Review</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeIcon = (type: Vendor["type"]) => {
        // You could use different icons here for each type
        return <Shop className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Vendor Ecosystem</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Strategic oversight for restaurants, grocery stores, and specialty markets
                    </p>
                </div>
                <Button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white transition-all font-bold rounded-xl h-12 px-6 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Onboard Vendor
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-6 border-border/50 animate-fade-in-up [animation-delay:100ms]">
<div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Find vendors by brand or principal agent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium"
                        />
                    </div>

                    {/* Service Type Tab-like Filter */}
                    <div className="hidden lg:flex items-center bg-accent/30 p-1 rounded-xl border border-border/50 gap-1 h-12">
                        {["all", "food", "grocery", "pharmacy", "market"].map((type) => (
                            <button
                                key={type}
                                onClick={() => { setTypeFilter(type as any); setCurrentPage(1); }}
                                className={`px-5 h-full rounded-lg text-sm font-black transition-all duration-300 ${typeFilter === type
                                    ? "bg-background text-[#FE6132] scale-110 border border-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                                    } uppercase tracking-tighter`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold bg-background hover:bg-accent transition-all">
                                <Filter className="w-4 h-4" />
                                Operation Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-1 px-2 py-0.5 text-[10px] bg-[#FE6132] text-white font-black border-0">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border-border/50">
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Market Segment</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setCurrentPage(1); }}>
                                <DropdownMenuRadioItem value="all" className="rounded-lg">All Entities</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="food" className="rounded-lg">Culinary/Food</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="grocery" className="rounded-lg">Grocery Supply</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pharmacy" className="rounded-lg">Healthcare/Pharma</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="market" className="rounded-lg">Open Market</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                            <DropdownMenuSeparator className="my-2" />

                            <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Operating State</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setCurrentPage(1); }}>
                                <DropdownMenuRadioItem value="all" className="rounded-lg">Universal View</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="open" className="rounded-lg">Open & Serving</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="busy" className="rounded-lg">High Demand/Busy</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="closed" className="rounded-lg">Closed/Offline</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="under_review" className="rounded-lg">Audit/Review</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                            {activeFilterCount > 0 && (
                                <>
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem onClick={clearFilters} className="text-destructive font-bold rounded-lg focus:bg-red-50 focus:text-red-600 transition-colors">
                                        <Xmark className="w-4 h-4 mr-2" />
                                        Reset Intel Filters
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all">
                        <Download className="w-4 h-4" />
                        Export Audit
                    </Button>
                </div>
            </Card>

            {/* List Table */}
            <Card className="overflow-hidden border-border/50 animate-fade-in-up">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-6 text-sm font-semibold">Entity Recognition</th>
                                <th className="text-left p-6 text-sm font-semibold">Division</th>
                                <th className="text-left p-6 text-sm font-semibold">Stakeholder Info</th>
                                <th className="text-left p-6 text-sm font-semibold">State</th>
                                <th className="text-left p-6 text-sm font-semibold">Trust Index</th>
                                <th className="text-left p-6 text-sm font-semibold">Capital Flow</th>
                                <th className="text-right p-6 text-sm font-semibold">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isInitialLoading ? (
                                // Skeleton Loaders
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-muted" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-muted rounded" />
                                                    <div className="h-2 w-16 bg-muted rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="h-4 w-20 bg-muted rounded-lg" />
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-2">
                                                <div className="h-4 w-28 bg-muted rounded" />
                                                <div className="h-3 w-24 bg-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="h-6 w-20 bg-muted rounded-full" />
                                        </td>
                                        <td className="p-6">
                                            <div className="h-4 w-12 bg-muted rounded" />
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-muted rounded" />
                                                <div className="h-2 w-20 bg-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="h-10 w-24 bg-muted rounded-xl ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                paginatedVendors.map((vendor, index) => (
                                    <tr
                                        key={vendor.id}
                                        className="hover:bg-accent/40 transition-all cursor-pointer group animate-fade-in-up border-b border-border/50 last:border-0"
                                        style={{ animationDelay: `${200 + index * 50}ms` }}
                                        onClick={() => router.push(`/vendors/${vendor.id}`)}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-foreground/5 flex items-center justify-center text-primary font-black transition-transform overflow-hidden relative border border-border/30">
                                                    {vendor.logo ? (
                                                        <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xl">{vendor.name.charAt(0)}</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground group-hover:text-[#FE6132] transition-colors flex items-center gap-2">
                                                        {vendor.name}
                                                        {vendor.isVerified && <CheckCircleSolid className="w-4 h-4 text-blue-500" />}
                                                    </div>
                                                    <div className="text-[10px] font-black font-mono text-muted-foreground uppercase opacity-60">ID-{vendor.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-accent/50 group-hover:bg-[#FE6132]/10 transition-colors">
                                                    {getTypeIcon(vendor.type)}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{vendor.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="font-bold text-sm text-foreground">{vendor.ownerName}</div>
                                                <div className="text-xs font-bold text-muted-foreground">{vendor.phone}</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="transition-transform origin-left">
                                                {getStatusBadge(vendor.status)}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                                                <span className="font-black text-foreground">{vendor.rating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="font-black text-[#FE6132]">GH₵ {vendor.totalRevenue.toLocaleString()}</div>
                                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{vendor.orderCount.toLocaleString()} Successful Orders</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Button size="sm" className="rounded-xl h-10 px-5 font-black bg-accent/40 text-foreground hover:bg-[#FE6132] hover:text-white transition-all border-0 ring-0">
                                                Manage Hub
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {paginatedVendors.length === 0 && !isInitialLoading && (
                    <div className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <Shop className="w-10 h-10 text-muted-foreground opacity-20" />
                            <h3 className="text-lg font-semibold">No vendors found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                Try adjusting your filters or search query to find the vendor your looking for.
                            </p>
                            <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    </div>
                )}

                <div className="border-t border-border/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20 h-8 border-border/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">per page</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {vendors.length > 0 ? startIndex + 1 : 0}-{endIndex} of {totalVendors} vendors
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border/50"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border/50"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            <RegisterVendorDialog
                open={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                onSuccess={handleRegisterSuccess}
            />
        </div>
    );
}
