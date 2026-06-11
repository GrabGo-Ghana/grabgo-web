"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Switch,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@grabgo/ui";
import { Settings } from "iconoir-react";
import { apiClient } from "@grabgo/utils";

interface PlatformSetting {
    key: string;
    value: string | number | boolean;
    label: string;
    description: string;
    type: "string" | "number" | "boolean";
}

export default function PlatformSettingsPage() {
    const [settings, setSettings] = useState<PlatformSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get("/admin/operations/settings");
                if (response.data.success) {
                    const data = response.data.data;
                    // Convert the settings object into an array for rendering
                    const settingsArray: PlatformSetting[] = Object.entries(data).map(([key, value]) => ({
                        key,
                        value: value as string | number | boolean,
                        label: key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, s => s.toUpperCase())
                            .replace(/_/g, ' '),
                        description: getSettingDescription(key),
                        type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string"
                    }));
                    setSettings(settingsArray);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const getSettingDescription = (key: string): string => {
        const descriptions: Record<string, string> = {
            maintenanceMode: "Enable to put the platform in maintenance mode",
            minOrderAmount: "Minimum order amount in GH₵ before checkout",
            maxDeliveryRadius: "Maximum delivery radius in kilometers",
            deliveryFeeBase: "Base delivery fee in GH₵",
            deliveryFeePerKm: "Additional fee per kilometer in GH₵",
            platformCommission: "Platform commission percentage on vendor sales",
            riderCommission: "Rider commission percentage per delivery",
            enableCOD: "Allow cash on delivery payment method",
            enableMoMo: "Allow mobile money payment method",
            enableCard: "Allow card payment method",
            maxConcurrentOrders: "Maximum concurrent orders per rider",
            autoAssignRiders: "Automatically assign nearest available rider",
            referralReward: "Reward amount in GH₵ for referral completion",
            enableReferralProgram: "Enable or disable the referral program",
            enableSubscriptions: "Enable or disable subscription plans",
        };
        return descriptions[key] || `Configure the ${key} setting`;
    };

    const handleChange = (key: string, value: any) => {
        setPendingChanges(prev => ({
            ...prev,
            [key]: value
        }));
        // Also update local display
        setSettings(prev =>
            prev.map(s => s.key === key ? { ...s, value } : s)
        );
    };

    const handleSave = () => {
        if (Object.keys(pendingChanges).length === 0) return;
        setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
        setIsSaving(true);
        setSaveError("");
        setSaveSuccess("");
        try {
            const response = await apiClient.put("/admin/operations/settings", {
                settings: pendingChanges,
                reason: "Platform settings updated by admin"
            });
            if (response.data.success) {
                setSaveSuccess("Settings updated successfully");
                setPendingChanges({});
                setShowConfirm(false);
                setTimeout(() => setSaveSuccess(""), 3000);
            } else {
                setSaveError(response.data.message || "Failed to update settings");
            }
        } catch (error: any) {
            setSaveError(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = Object.keys(pendingChanges).length > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Platform Settings</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Configure platform-wide variables, toggles, and operational parameters
                    </p>
                </div>
                {hasChanges && (
                    <Button
                        onClick={handleSave}
                        className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl h-12 px-6 font-bold active:scale-95 transition-all"
                    >
                        Save Changes ({Object.keys(pendingChanges).length})
                    </Button>
                )}
            </div>

            {saveSuccess && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-sm animate-fade-in-up">
                    ✓ {saveSuccess}
                </div>
            )}
            {saveError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-sm">
                    {saveError}
                </div>
            )}

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="p-6 border-border/50 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-5 w-48 bg-muted rounded" />
                                    <div className="h-4 w-72 bg-muted rounded" />
                                </div>
                                <div className="h-10 w-20 bg-muted rounded" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : settings.length === 0 ? (
                <Card className="p-12 border-border/50 text-center">
                    <div className="flex flex-col items-center space-y-3">
                        <Settings className="w-10 h-10 text-muted-foreground opacity-20" />
                        <h3 className="text-lg font-semibold">No settings found</h3>
                        <p className="text-muted-foreground text-sm">Platform settings have not been configured yet.</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {settings.map((setting, index) => (
                        <Card
                            key={setting.key}
                            className={`p-6 border-border/50 transition-all animate-fade-in-up ${
                                pendingChanges[setting.key] !== undefined ? "ring-2 ring-[#FE6132]/30 border-[#FE6132]/50" : ""
                            }`}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 mr-8">
                                    <h3 className="font-bold text-foreground">{setting.label}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    {setting.type === "boolean" ? (
                                        <Switch
                                            checked={setting.value as boolean}
                                            onCheckedChange={(checked) => handleChange(setting.key, checked)}
                                        />
                                    ) : setting.type === "number" ? (
                                        <Input
                                            type="number"
                                            value={setting.value as number}
                                            onChange={(e) => handleChange(setting.key, Number(e.target.value))}
                                            className="w-32 h-10 rounded-xl border-border/50 text-right font-bold"
                                        />
                                    ) : (
                                        <Input
                                            value={setting.value as string}
                                            onChange={(e) => handleChange(setting.key, e.target.value)}
                                            className="w-48 h-10 rounded-xl border-border/50 font-medium"
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Confirm Save Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="rounded-2xl border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Confirm Settings Update</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-[#FE6132]/20">
                            <p className="text-sm font-bold text-[#FE6132] mb-3">
                                You are about to update {Object.keys(pendingChanges).length} setting(s):
                            </p>
                            <div className="space-y-2">
                                {Object.entries(pendingChanges).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted-foreground">{key}</span>
                                        <span className="font-bold text-foreground">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            These changes will take effect immediately across the entire platform.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl">Cancel</Button>
                        <Button
                            onClick={handleConfirmSave}
                            disabled={isSaving}
                            className="bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white rounded-xl font-bold"
                        >
                            {isSaving ? "Saving..." : "Confirm & Apply"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
