/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@grabgo/ui";
import {
    ArrowLeft,
    Cycling,
    Star,
    CheckCircleSolid,
    InfoCircle,
    Settings,
    Database,
    Clock,
    Xmark,
} from "iconoir-react";
import { format } from "date-fns";
import { apiClient } from "@grabgo/utils";

interface RiderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function RiderDetailPage({ params }: RiderPageProps) {
    const router = useRouter();
    const { id } = use(params);
    const [rider, setRider] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadRiderData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(`/admin/riders/${id}`);
                if (response.data.success && isMounted) {
                    setRider(response.data.data);
                } else {
                    setError("Failed to load rider details");
                }
            } catch (err: any) {
                console.error("Error loading rider details:", err);
                if (isMounted) {
                    setError(err.response?.data?.message || "Server error loading rider details");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadRiderData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleUpdateStatus = async (status: string, reasonStr?: string) => {
        setIsSubmitting(true);
        try {
            const res = await apiClient.put(`/admin/riders/${id}/verification`, {
                status,
                rejectionReason: reasonStr || undefined
            });

            if (res.data.success) {
                setRider((prev: any) => ({
                    ...prev,
                    verificationStatus: status,
                    rejectionReason: reasonStr || null
                }));
                alert(`Rider verification status updated to ${status}!`);
                setShowRejectForm(false);
                setRejectionReason("");
            }
        } catch (err: any) {
            console.error("Failed to update verification status:", err);
            alert(err.response?.data?.message || "Failed to update status.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FE6132]" />
            </div>
        );
    }

    if (error || !rider) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground font-medium">{error || "Rider not found."}</p>
                <Link href="/riders">
                    <Button variant="outline">Back to Fleet</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/riders">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fleet
                    </Button>
                </Link>
            </div>

            {/* Profile Header */}
            <Card className="p-6 border-border/50 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-6 flex-1">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-md bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                            {rider.selfiePhoto ? (
                                <img src={rider.selfiePhoto} alt={rider.name} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                rider.name.charAt(0).toUpperCase()
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">{rider.name}</h1>
                                    {rider.verificationStatus === "approved" && <CheckCircleSolid className="w-5 h-5 text-blue-500" />}
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <span className="capitalize">{rider.vehicleType}</span>
                                    <span>•</span>
                                    <span>{rider.id}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                {getStatusBadge(rider.verificationStatus)}
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {rider.rating.toFixed(1)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {rider.phone}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {rider.verificationStatus !== "approved" && (
                            <Button
                                className="h-10 md:h-9 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleUpdateStatus("approved")}
                                disabled={isSubmitting}
                            >
                                Approve Partner
                            </Button>
                        )}
                        {rider.verificationStatus !== "under_review" && (
                            <Button
                                variant="outline"
                                className="h-10 md:h-9 border-border/50"
                                onClick={() => handleUpdateStatus("under_review")}
                                disabled={isSubmitting}
                            >
                                Mark Under Review
                            </Button>
                        )}
                        {rider.verificationStatus !== "rejected" && !showRejectForm && (
                            <Button
                                className="h-10 md:h-9 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => setShowRejectForm(true)}
                                disabled={isSubmitting}
                            >
                                Reject File
                            </Button>
                        )}
                    </div>
                </div>

                {/* Rejection Reason Form */}
                {showRejectForm && (
                    <div className="mt-6 border-t border-border/50 pt-6 space-y-4 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Specify Rejection Reason</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why the document verification failed (e.g. illegible National ID card, expired driver's license)"
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleUpdateStatus("rejected", rejectionReason)}
                                disabled={isSubmitting || !rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => { setShowRejectForm(false); setRejectionReason(""); }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Tabs */}
            <Card className="border-border/50 overflow-hidden animate-fade-in-up">
                <Tabs defaultValue="documents" className="w-full">
                    <div className="border-b border-border/50">
                        <TabsList className="bg-transparent h-auto p-0 w-full justify-start px-6">
                            <TabsTrigger
                                value="documents"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                <Database className="w-4 h-4 mr-2" />
                                Onboarding Documents
                            </TabsTrigger>
                            <TabsTrigger
                                value="personal"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FE6132] data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-all px-6 py-4 font-medium"
                            >
                                <InfoCircle className="w-4 h-4 mr-2" />
                                Partner Details
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* National ID Document */}
                            <div className="border border-border/50 rounded-xl p-4 bg-muted/20 space-y-4">
                                <h3 className="font-bold text-sm text-foreground">National Identity Card</h3>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-bold uppercase">Front Photo</p>
                                    <div className="aspect-[16/10] rounded-lg bg-card border border-border/30 overflow-hidden flex items-center justify-center">
                                        {rider.idFrontImage ? (
                                            <img src={rider.idFrontImage} alt="National ID Front" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Not Uploaded</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1 border-t border-border/50 pt-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID Type:</span>
                                        <span className="font-semibold">{rider.nationalIdType || 'Ghana Card'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID Number:</span>
                                        <span className="font-semibold font-mono">{rider.nationalIdNumber || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selfies Verification */}
                            <div className="border border-border/50 rounded-xl p-4 bg-muted/20 space-y-4">
                                <h3 className="font-bold text-sm text-foreground">Selfie Verification</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Selfie Photo</p>
                                        <div className="aspect-[4/3] rounded-lg bg-card border border-border/30 overflow-hidden flex items-center justify-center">
                                            {rider.selfiePhoto ? (
                                                <img src={rider.selfiePhoto} alt="Rider Selfie" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Not Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Selfie With ID</p>
                                        <div className="aspect-[4/3] rounded-lg bg-card border border-border/30 overflow-hidden flex items-center justify-center">
                                            {rider.selfieWithIdPhoto ? (
                                                <img src={rider.selfieWithIdPhoto} alt="Rider Selfie with ID" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Not Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Verify that the faces on the ID and selfie photos match exactly.</p>
                            </div>

                            {/* Vehicle Verification */}
                            <div className="border border-border/50 rounded-xl p-4 bg-muted/20 space-y-4 md:col-span-2">
                                <h3 className="font-bold text-sm text-foreground">Vehicle Registration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Vehicle Image</p>
                                        <div className="aspect-[2/1] rounded-lg bg-card border border-border/30 overflow-hidden flex items-center justify-center max-w-md">
                                            {rider.vehicleImage ? (
                                                <img src={rider.vehicleImage} alt="Vehicle Image" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Not Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-border/30 pb-2">
                                            <span className="text-muted-foreground">Vehicle Type:</span>
                                            <span className="font-semibold capitalize">{rider.vehicleType}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-border/30 pb-2">
                                            <span className="text-muted-foreground">Brand / Make:</span>
                                            <span className="font-semibold">{rider.vehicleBrand || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-border/30 pb-2">
                                            <span className="text-muted-foreground">Model Name:</span>
                                            <span className="font-semibold">{rider.vehicleModel || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-border/30 pb-2">
                                            <span className="text-muted-foreground">License Plate:</span>
                                            <span className="font-semibold font-mono">{rider.licensePlateNumber || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Personal Details Tab */}
                    <TabsContent value="personal" className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Full Name</label>
                                        <p className="mt-1 font-medium">{rider.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Email</label>
                                        <p className="mt-1 font-medium">{rider.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Phone Number</label>
                                        <p className="mt-1 font-medium">{rider.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Registered Date</label>
                                        <p className="mt-1 font-medium">{format(new Date(rider.createdAt), "PPP")}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Emergency Contact</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="col-span-2">
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Contact Name</label>
                                        <p className="mt-1 font-medium">{rider.emergencyContactFullName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Phone Number</label>
                                        <p className="mt-1 font-medium">{rider.emergencyContactPhoneNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground font-bold uppercase">Relationship</label>
                                        <p className="mt-1 font-medium">{rider.emergencyContactRelationship || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
