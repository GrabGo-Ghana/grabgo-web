"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Card,
    Badge,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@grabgo/ui";
import {
    Search,
    Plus,
    Database,
} from "iconoir-react";
import { apiClient } from "@grabgo/utils";

interface CategoryDto {
    id: string;
    name: string;
    imageUrl?: string | null;
}

interface RestaurantDto {
    id: string;
    restaurantName?: string | null;
    name?: string | null;
    logo?: string | null;
}

interface FoodItemDto {
    id: string;
    name?: string | null;
    description?: string | null;
    price?: number | string | null;
    foodImage?: string | null;
    image?: string | null;
    isAvailable?: boolean | null;
    categoryId?: string | null;
    categoryName?: string | null;
    category?: {
        id?: string | null;
        name?: string | null;
    } | null;
    restaurantId?: string | null;
    sellerName?: string | null;
    restaurant?: {
        id?: string | null;
        restaurantName?: string | null;
        name?: string | null;
        logo?: string | null;
    } | null;
}

interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    restaurant: { id: string; name: string };
    image: string | null;
    inStock: boolean;
    searchText: string;
}

type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

const mapFoodItem = (item: FoodItemDto): FoodItem => {
    const name = item.name || "Untitled item";
    const description = item.description || "";

    return {
        id: item.id,
        name,
        description,
        price: Number(item.price ?? 0),
        category: item.category?.name || item.categoryName || "Uncategorized",
        restaurant: {
            id: item.restaurant?.id || item.restaurantId || "",
            name:
                item.restaurant?.restaurantName ||
                item.restaurant?.name ||
                item.sellerName ||
                "N/A",
        },
        image: item.foodImage || item.image || null,
        inStock: Boolean(item.isAvailable),
        searchText: `${name} ${description}`.toLowerCase(),
    };
};

export default function FoodItemsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedRestaurant, setSelectedRestaurant] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("all");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const deferredSearchQuery = useDeferredValue(searchQuery);

    useEffect(() => {
        let isActive = true;
        const controller = new AbortController();

        const loadFilters = async () => {
            try {
                const [categoriesResponse, restaurantsResponse] = await Promise.all([
                    apiClient.get("/categories", { signal: controller.signal }),
                    apiClient.get("/restaurants", { signal: controller.signal }),
                ]);

                if (!isActive) return;

                setCategories(categoriesResponse.data?.data ?? []);
                setRestaurants(restaurantsResponse.data?.data ?? []);
            } catch (err) {
                if (!isActive) return;
                console.error("Failed to load food item filters:", err);
            }
        };

        loadFilters();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let isActive = true;
        const controller = new AbortController();

        const loadFoods = async () => {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (selectedCategory !== "all") params.set("category", selectedCategory);
            if (selectedRestaurant !== "all") params.set("restaurant", selectedRestaurant);

            try {
                const response = await apiClient.get(`/foods?${params.toString()}`, {
                    signal: controller.signal,
                });
                if (!isActive) return;

                const items = (response.data?.data ?? []).map(mapFoodItem);
                setFoodItems(items);
                const itemIds = new Set(items.map((item: FoodItem) => item.id));
                setSelectedItems((selected) => selected.filter((id) => itemIds.has(id)));
            } catch (err) {
                if (!isActive) return;
                console.error("Failed to load food items:", err);
                setError("Unable to load food items right now.");
                setFoodItems([]);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        loadFoods();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [selectedCategory, selectedRestaurant]);

    const selectedCategoryName = useMemo(() => {
        if (selectedCategory === "all") return null;
        return categories.find((cat) => cat.id === selectedCategory)?.name || selectedCategory;
    }, [categories, selectedCategory]);

    const selectedRestaurantName = useMemo(() => {
        if (selectedRestaurant === "all") return null;
        const restaurant = restaurants.find((rest) => rest.id === selectedRestaurant);
        return restaurant?.restaurantName || restaurant?.name || selectedRestaurant;
    }, [restaurants, selectedRestaurant]);
    const normalizedSearchQuery = useMemo(
        () => deferredSearchQuery.trim().toLowerCase(),
        [deferredSearchQuery]
    );

    const minPrice = useMemo(() => {
        if (priceRange.min === "") return Number.NEGATIVE_INFINITY;
        const value = Number(priceRange.min);
        return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
    }, [priceRange.min]);

    const maxPrice = useMemo(() => {
        if (priceRange.max === "") return Number.POSITIVE_INFINITY;
        const value = Number(priceRange.max);
        return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
    }, [priceRange.max]);

    const filteredItems = useMemo(() => {
        return foodItems.filter((item) => {
            const matchesSearch =
                normalizedSearchQuery.length === 0 ||
                item.searchText.includes(normalizedSearchQuery);
            const matchesAvailability =
                availabilityFilter === "all" ||
                (availabilityFilter === "in-stock" && item.inStock) ||
                (availabilityFilter === "out-of-stock" && !item.inStock);
            const matchesPrice = item.price >= minPrice && item.price <= maxPrice;

            return matchesSearch && matchesAvailability && matchesPrice;
        });
    }, [foodItems, normalizedSearchQuery, availabilityFilter, minPrice, maxPrice]);

    const selectedItemSet = useMemo(() => new Set(selectedItems), [selectedItems]);
    const shouldAnimateCards = filteredItems.length <= 24;

    const handleToggleItemSelection = useCallback((itemId: string) => {
        setSelectedItems((current) =>
            current.includes(itemId)
                ? current.filter((id) => id !== itemId)
                : [...current, itemId]
        );
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Food Items</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Manage food items across all restaurants
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/food-items/categories">
                        <Button
                            variant="outline"
                            className="gap-2"
                        >
                            <Database className="w-4 h-4" />
                            Manage Categories
                        </Button>
                    </Link>
                    <Button className="gap-2 bg-gradient-to-br from-[#FE6132] to-[#FE6132]/80 text-white hover:opacity-90">
                        <Plus className="w-4 h-4" />
                        Add Food Item
                    </Button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
                <Card className="p-4 border-border/50 bg-[#FE6132]/5 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    alert(`Marked ${selectedItems.length} items as In Stock`);
                                    setSelectedItems([]);
                                }}
                                className="inline-flex items-center justify-center gap-2 h-8 rounded-full px-4 text-sm font-semibold transition-all bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 active:scale-95"
                            >
                                Mark as In Stock
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Marked ${selectedItems.length} items as Out of Stock`);
                                    setSelectedItems([]);
                                }}
                                className="inline-flex items-center justify-center gap-2 h-8 rounded-full px-4 text-sm font-semibold transition-all bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 active:scale-95"
                            >
                                Mark as Out of Stock
                            </button>
                            <button
                                onClick={() => setSelectedItems([])}
                                className="inline-flex items-center justify-center gap-2 h-8 rounded-full px-4 text-sm font-medium transition-all bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:scale-95"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Filters */}
            <Card className="p-6 border-border/50">
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search food items by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full h-10 border-input bg-background px-3 text-sm">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="bg-card text-foreground">
                                    <SelectItem value="all">All</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Restaurant Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Restaurant</label>
                            <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                                <SelectTrigger className="w-full h-10 border-input bg-background px-3 text-sm">
                                    <SelectValue placeholder="All Restaurants" />
                                </SelectTrigger>
                                <SelectContent className="bg-card text-foreground">
                                    <SelectItem value="all">All Restaurants</SelectItem>
                                    {restaurants.map(rest => (
                                        <SelectItem key={rest.id} value={rest.id}>
                                            {rest.restaurantName || rest.name || "Unnamed restaurant"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Availability</label>
                            <Select
                                value={availabilityFilter}
                                onValueChange={(value) => setAvailabilityFilter(value as AvailabilityFilter)}
                            >
                                <SelectTrigger className="w-full h-10 border-input bg-background px-3 text-sm">
                                    <SelectValue placeholder="All Items" />
                                </SelectTrigger>
                                <SelectContent className="bg-card text-foreground">
                                    <SelectItem value="all">All Items</SelectItem>
                                    <SelectItem value="in-stock">In Stock</SelectItem>
                                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Price Range
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    min="0"
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    placeholder="Min"
                                />
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    min="0"
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {selectedCategoryName && (
                            <Badge variant="outline" className="gap-1">
                                Category: {selectedCategoryName}
                            </Badge>
                        )}
                        {selectedRestaurantName && (
                            <Badge variant="outline" className="gap-1">
                                Restaurant: {selectedRestaurantName}
                            </Badge>
                        )}
                        {availabilityFilter !== "all" && (
                            <Badge variant="outline" className="gap-1">
                                {availabilityFilter === "in-stock" ? "In Stock" : "Out of Stock"}
                            </Badge>
                        )}
                        {(priceRange.min !== "" || priceRange.max !== "") && (
                            <Badge variant="outline" className="gap-1">
                                GH₵{priceRange.min || "0"} - GH₵{priceRange.max || "Any"}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>
            {error && (
                <Card className="p-4 border-red-200 bg-red-50 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                    {error}
                </Card>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredItems.length}</span> of{" "}
                    <span className="font-medium text-foreground">{foodItems.length}</span> food items
                </p>
            </div>

            {/* Food Items Grid */}
            {isLoading ? (
                // Skeleton Loaders
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={`skeleton-${i}`} className="p-4 border-border/50 animate-pulse">
                            <div className="flex gap-4">
                                {/* Image Skeleton */}
                                <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0" />

                                {/* Details Skeleton */}
                                <div className="flex-1 space-y-2 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="h-4 w-32 bg-muted rounded" />
                                        <div className="h-4 w-16 bg-muted rounded" />
                                    </div>
                                    <div className="h-3 w-full bg-muted rounded" />
                                    <div className="h-3 w-3/4 bg-muted rounded" />
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="h-5 w-20 bg-muted rounded-full" />
                                        <div className="h-3 w-16 bg-muted rounded" />
                                    </div>
                                    <div className="h-3 w-24 bg-muted rounded" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item, idx) => (
                        <div key={item.id} className="relative">
                            <input
                                type="checkbox"
                                checked={selectedItemSet.has(item.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleToggleItemSelection(item.id);
                                }}
                                className="absolute top-6 left-6 z-10 w-4 h-4 rounded border-2 border-border cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Link href={`/food-items/${item.id}`}>
                                <Card
                                    className={`p-4 border-border/50 transition-all group cursor-pointer ${shouldAnimateCards ? "animate-fade-in-up" : ""}`}
                                    style={shouldAnimateCards ? { animationDelay: `${Math.min(idx, 12) * 35}ms` } : undefined}
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 transition-transform overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Database className="w-8 h-8 opacity-40" />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-bold text-sm group-hover:text-[#FE6132] transition-colors line-clamp-1">
                                                    {item.name}
                                                </h4>
                                                <span className="text-sm font-black text-[#FE6132] whitespace-nowrap">
                                                    GH₵ {item.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge className="text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider bg-accent/50 text-foreground border-0">
                                                    {item.category}
                                                </Badge>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${item.inStock ? "bg-green-500" : "bg-red-500"}`} />
                                                    <span className="text-[10px] uppercase text-muted-foreground font-medium">
                                                        {item.inStock ? "In Stock" : "Out of Stock"}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.restaurant.name}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="p-12 border-border/50 text-center">
                    <Database className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Food Items Found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto text-sm mt-2">
                        No food items match your current filters. Try adjusting your search criteria.
                    </p>
                </Card>
            )}
        </div>
    );
}
