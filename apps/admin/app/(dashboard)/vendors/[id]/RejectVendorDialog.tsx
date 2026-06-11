"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@grabgo/ui";
import { Button, Label } from "@grabgo/ui";
import { type Vendor } from "../../../../lib/mockData";
import { apiClient } from "@grabgo/utils";

const rejectVendorSchema = z.object({
    reason: z.string().min(20, "Please provide a detailed reason (minimum 20 characters)"),
});

type RejectVendorFormData = z.infer<typeof rejectVendorSchema>;

interface RejectVendorDialogProps {
    vendor: Vendor;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (status: any) => void;
}

export function RejectVendorDialog({
    vendor,
    open,
    onOpenChange,
    onSuccess,
}: RejectVendorDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RejectVendorFormData>({
        resolver: zodResolver(rejectVendorSchema),
        defaultValues: {
            reason: "",
        },
    });

    const onSubmit = async (data: RejectVendorFormData) => {
        setIsSubmitting(true);
        try {
            let dbType = "";
            if (vendor.type === "food") dbType = "restaurant";
            else if (vendor.type === "grocery") dbType = "grocery";
            else if (vendor.type === "pharmacy") dbType = "pharmacy";
            else if (vendor.type === "market") dbType = "grabmart";

            const res = await apiClient.put(`/admin/vendors/${dbType}/${vendor.id}/status`, {
                status: "rejected",
                rejectionReason: data.reason
            });

            if (res.data.success) {
                alert(`Vendor application rejected. Reason sent to ${vendor.email}`);
                if (onSuccess) onSuccess("closed");
            }
        } catch (err) {
            console.error("Failed to reject vendor application:", err);
            alert("Failed to reject vendor application.");
        } finally {
            setIsSubmitting(false);
            onOpenChange(false);
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Reject Vendor Application</DialogTitle>
                    <DialogDescription>
                        Provide a detailed reason for rejecting this vendor application. The reason will be sent to the vendor.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Vendor Info */}
                    <div className="rounded-lg border border-border/50 p-4 bg-muted/30">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Vendor:</span>
                                <span className="font-medium">{vendor.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Owner:</span>
                                <span className="font-medium">{vendor.ownerName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{vendor.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="font-medium capitalize">{vendor.type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason *</Label>
                        <textarea
                            id="reason"
                            {...register("reason")}
                            placeholder="Enter detailed reason for rejection (e.g., incomplete documents, invalid business license, etc.)"
                            rows={5}
                            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.reason ? "border-destructive" : ""
                                }`}
                        />
                        {errors.reason && (
                            <p className="text-sm text-destructive">{errors.reason.message}</p>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 p-4">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>Note:</strong> The vendor will receive an email with your rejection reason. They can reapply after addressing the issues.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                reset();
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting ? "Rejecting..." : "Reject Application"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
