"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@grabgo/ui";
import { Button } from "@grabgo/ui";
import { Search, Cycling } from "iconoir-react";
import { apiClient } from "@grabgo/utils";

interface Rider {
    id: string;
    name: string;
    phone: string;
    rating: number;
    totalTrips: number;
    vehicleType: string;
    vehicleNumber?: string;
    verificationStatus: string;
    isActive: boolean;
}

interface AssignRiderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAssign: (riderId: string) => void;
    currentRiderId?: string;
}

export function AssignRiderDialog({ open, onOpenChange, onAssign, currentRiderId }: AssignRiderDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRiderId, setSelectedRiderId] = useState<string | null>(currentRiderId || null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        
        const fetchRiders = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get('/admin/riders?status=approved&limit=100');
                if (res.data && res.data.success) {
                    setRiders(res.data.data.riders);
                }
            } catch (err) {
                console.error("Failed to load riders for assignment:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRiders();
    }, [open]);

    const filteredRiders = riders.filter(rider => {
        const matchesSearch = !searchQuery ||
            rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rider.phone.includes(searchQuery) ||
            (rider.vehicleNumber && rider.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const handleAssign = async () => {
        if (!selectedRiderId) return;

        setIsAssigning(true);
        try {
            await onAssign(selectedRiderId);
            onOpenChange(false);
        } catch (err) {
            console.error("Rider assignment failed:", err);
        } finally {
            setIsAssigning(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'inactive':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {currentRiderId ? 'Reassign Rider' : 'Assign Rider'}
                    </DialogTitle>
                    <DialogDescription>
                        Select a rider to {currentRiderId ? 'reassign' : 'assign'} to this order
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or vehicle number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#FE6132]/20"
                        />
                    </div>

                    {/* Riders List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading riders...
                            </div>
                        ) : filteredRiders.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No riders found
                            </div>
                        ) : (
                            filteredRiders.map((rider) => (
                                <button
                                    key={rider.id}
                                    onClick={() => setSelectedRiderId(rider.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedRiderId === rider.id
                                            ? 'border-[#FE6132] bg-[#FE6132]/5'
                                            : 'border-border hover:border-[#FE6132]/50 hover:bg-accent/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-full bg-accent">
                                            <Cycling className="w-5 h-5 text-[#FE6132]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="font-semibold">{rider.name}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(rider.isActive ? 'active' : 'inactive')}`}>
                                                    {rider.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                <span>{rider.phone}</span>
                                                <span>•</span>
                                                <span>{rider.vehicleType}</span>
                                                {rider.vehicleNumber && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{rider.vehicleNumber}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span>⭐</span>
                                                    <span className="font-medium">{rider.rating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {rider.totalTrips} deliveries
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isAssigning}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedRiderId || isAssigning}
                        className="bg-[#FE6132] hover:bg-[#FE6132]/90"
                    >
                        {isAssigning ? 'Assigning...' : currentRiderId ? 'Reassign Rider' : 'Assign Rider'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
