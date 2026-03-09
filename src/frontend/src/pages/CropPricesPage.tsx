import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { mockCropPrices } from "../data/mockData";
import { useAllCropPrices } from "../hooks/useQueries";

export function CropPricesPage() {
  const [search, setSearch] = useState("");
  const { data: cropPrices, isLoading } = useAllCropPrices();

  const prices =
    cropPrices && cropPrices.length > 0 ? cropPrices : mockCropPrices;

  const filtered = prices.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.cropName.toLowerCase().includes(q) ||
      p.marketName.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // Price tier coloring
  const getPriceBadge = (price: number) => {
    if (price >= 5000) return "bg-green-100 text-green-800 border-green-200";
    if (price >= 2000) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="farm-gradient px-4 pt-6 pb-14">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                Mandi Prices
              </h1>
              <p className="text-white/80 text-sm">
                Updated:{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 max-w-lg mx-auto space-y-4">
        {/* Search */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-ocid="crop_prices.search_input"
              type="text"
              placeholder="Search crop or mandi name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {filtered.length} crops found
          </p>
        </div>

        {/* Summary cards */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-xs text-green-700 font-medium">Highest</p>
              <p className="font-display font-bold text-sm text-green-800 mt-0.5">
                {prices.reduce(
                  (a, b) => (a.pricePerQuintal > b.pricePerQuintal ? a : b),
                  prices[0],
                )?.cropName || "—"}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-700 font-medium">Markets</p>
              <p className="font-display font-bold text-sm text-blue-800 mt-0.5">
                {new Set(prices.map((p) => p.marketName)).size}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-700 font-medium">Crops</p>
              <p className="font-display font-bold text-sm text-amber-800 mt-0.5">
                {prices.length}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12"
            data-ocid="crop_prices.empty_state"
          >
            <span className="text-5xl">🌾</span>
            <p className="font-display font-bold text-lg text-foreground mt-3">
              No Results Found
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Try a different crop or market name
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <Table data-ocid="crop_prices.table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">
                    Crop
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Price/Quintal
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                    Market
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((crop, i) => (
                  <TableRow
                    key={`${crop.cropName}-${i}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {crop.cropName}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {crop.marketName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`${getPriceBadge(crop.pricePerQuintal)} font-bold`}
                      >
                        ₹{crop.pricePerQuintal.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {crop.marketName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell text-right">
                      {formatDate(crop.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Trend note */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-foreground">
              Live Mandi Prices
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Prices shown are indicative based on major Indian mandis. Actual
              prices may vary at local markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
