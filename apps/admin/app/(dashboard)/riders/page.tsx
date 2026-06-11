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
import { Search, Filter, Download, Plus, Star, Cycling, Xmark, CheckCircleSolid } from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

export default function RidersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected" | "under_review">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [riders, setRiders] = useState<any[]>([]);
    const [totalRiders, setTotalRiders] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchRiders = async () => {
            setIsInitialLoading(true);
            try {
                const mappedStatus = statusFilter === "all" ? "" : statusFilter;
                const response = await apiClient.get(
                    `/admin/riders?page=${currentPage}&limit=${itemsPerPage}&status=${mappedStatus}&q=${searchQuery}`
                );

                if (isMounted && response.data.success) {
                    setRiders(response.data.data.riders);
                    setTotalRiders(response.data.data.total);
                }
            } catch (error) {
                console.error("Failed to fetch riders:", error);
            } finally {
                if (isMounted) {
                    setIsInitialLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchRiders();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [currentPage, itemsPerPage, statusFilter, searchQuery]);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalRiders / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + riders.length, totalRiders);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge variant="success">Approved</Badge>;
            case "pending":
                return <Badge variant="warning">Pending</Badge>;
            case "under_review":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-transparent dark:bg-blue-500/20 dark:text-blue-400">Under Review</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const activeFilterCount = statusFilter !== "all" ? 1 : 0;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Rider Fleet</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Verify rider applications, inspect transport documents, and manage platform partners
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-6 border-border/50 animate-fade-in-up [animation-delay:100ms]">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#FE6132] transition-colors" />
                        <Input
                            placeholder="Find riders by name, contact, national ID or license plate..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-accent/30 border-border/50 focus:bg-background transition-all rounded-xl font-medium"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold bg-background hover:bg-accent transition-all">
                                <Filter className="w-4 h-4" />
                                Onboarding Status
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-1 px-2 py-0.5 text-[10px] bg-[#FE6132] text-white font-black border-0">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border-border/50">
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Verification State</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setCurrentPage(1); }}>
                                <DropdownMenuRadioItem value="all" className="rounded-lg">All Statuses</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pending" className="rounded-lg">Pending Review</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="under_review" className="rounded-lg">Under Review</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="approved" className="rounded-lg">Approved / Active</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="rejected" className="rounded-lg">Rejected / Blocked</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                            {activeFilterCount > 0 && (
                                <>
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem onClick={clearFilters} className="text-destructive font-bold rounded-lg focus:bg-red-50 focus:text-red-600 transition-colors">
                                        <Xmark className="w-4 h-4 mr-2" />
                                        Reset Filters
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="gap-2 border-border/50 h-12 px-5 rounded-xl font-bold transition-all">
                        <Download className="w-4 h-4" />
                        Export Sheet
                    </Button>
                </div>
            </Card>

            {/* Fleet Table */}
            <Card className="overflow-hidden border-border/50 animate-fade-in-up">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="text-left p-6 text-sm font-semibold">Rider</th>
                                <th className="text-left p-6 text-sm font-semibold">Vehicle</th>
                                <th className="text-left p-6 text-sm font-semibold">Contact Details</th>
                                <th className="text-left p-6 text-sm font-semibold">Status</th>
                                <th className="text-left p-6 text-sm font-semibold">Rating</th>
                                <th className="text-left p-6 text-sm font-semibold">Total Deliveries</th>
                                <th className="text-left p-6 text-sm font-semibold">Onboarded</th>
                                <th className="text-right p-6 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isInitialLoading ? (
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
                                            <div className="h-4 w-16 bg-muted rounded" />
                                        </td>
                                        <td className="p-6">
                                            <div className="h-4 w-24 bg-muted rounded" />
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="h-10 w-24 bg-muted rounded-xl ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                riders.map((rider, index) => (
                                    <tr
                                        key={rider.id}
                                        className="hover:bg-accent/40 transition-all cursor-pointer group animate-fade-in-up border-b border-border/50 last:border-0"
                                        style={{ animationDelay: `${200 + index * 50}ms` }}
                                        onClick={() => router.push(`/riders/${rider.id}`)}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-foreground/5 flex items-center justify-center text-primary font-black border border-border/30">
                                                    <Cycling className="w-6 h-6 text-[#FE6132]" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground group-hover:text-[#FE6132] transition-colors flex items-center gap-2">
                                                        {rider.name}
                                                    </div>
                                                    <div className="text-[10px] font-black font-mono text-muted-foreground uppercase opacity-60">ID-{rider.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground bg-accent px-2.5 py-1 rounded-md">{rider.vehicleType}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="font-bold text-sm text-foreground">{rider.email}</div>
                                                <div className="text-xs font-bold text-muted-foreground">{rider.phone}</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="transition-transform origin-left">
                                                {getStatusBadge(rider.verificationStatus)}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-black text-foreground">{rider.rating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-black text-foreground">{rider.totalTrips.toLocaleString()}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-sm font-bold text-muted-foreground">
                                                {format(new Date(rider.createdAt), "MMM dd, yyyy")}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Button size="sm" className="rounded-xl h-10 px-5 font-black bg-accent/40 text-foreground hover:bg-[#FE6132] hover:text-white transition-all border-0 ring-0">
                                                Verify Files
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {riders.length === 0 && !isInitialLoading && (
                    <div className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <Cycling className="w-10 h-10 text-muted-foreground opacity-20" />
                            <h3 className="text-lg font-semibold">No riders found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                                Try adjusting your filters or search query to find the rider partner you are looking for.
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
                                // Set items per page
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
                        Showing {riders.length > 0 ? startIndex + 1 : 0}-{endIndex} of {totalRiders} riders
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
        </div>
    );
}
