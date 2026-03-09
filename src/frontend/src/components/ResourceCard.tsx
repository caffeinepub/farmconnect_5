import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  IndianRupee,
  Loader2,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import type { Resource } from "../backend.d";
import { useResourceAvailability } from "../hooks/useQueries";

interface ResourceCardProps {
  resource: Resource;
  index: number;
  scopePrefix: string;
  selectedDate: string;
  onBook: (resource: Resource) => void;
}

export function ResourceCard({
  resource,
  index,
  scopePrefix,
  selectedDate,
  onBook,
}: ResourceCardProps) {
  const [hovered, setHovered] = useState(false);

  const { data: isAvailable, isLoading: checkingAvailability } =
    useResourceAvailability(resource.id, selectedDate, !!selectedDate);

  // If no date selected, use the resource's isAvailable property
  // If date is selected, use the availability from backend
  const available = selectedDate
    ? isAvailable !== undefined
      ? isAvailable
      : resource.isAvailable
    : resource.isAvailable;

  return (
    <Card
      data-ocid={`${scopePrefix}.item.${index}`}
      className={`overflow-hidden card-hover cursor-default border-border ${
        !available ? "opacity-80" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="p-0">
        {/* Color accent top */}
        <div className={`h-1.5 ${available ? "farm-gradient" : "bg-muted"}`} />

        <div className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-foreground truncate">
                {resource.ownerName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {resource.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {checkingAvailability && selectedDate ? (
                <Badge variant="outline" className="bg-muted">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  <span className="text-xs">Checking</span>
                </Badge>
              ) : available ? (
                <Badge
                  variant="outline"
                  className="status-available whitespace-nowrap"
                >
                  ✓ Available
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="status-booked whitespace-nowrap"
                >
                  ✗ Booked
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <IndianRupee className="h-4 w-4" />
              <span>₹{resource.pricePerDay.toLocaleString()}/day</span>
            </div>
            {resource.distanceKm !== undefined && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{resource.distanceKm} km away</span>
              </div>
            )}
          </div>

          {/* Book button */}
          <Button
            data-ocid={`${scopePrefix}.book_button.${index}`}
            onClick={() => onBook(resource)}
            disabled={!available || !selectedDate}
            className={`w-full font-semibold transition-all ${
              available && selectedDate
                ? `farm-gradient text-white border-0 hover:opacity-90 ${hovered ? "shadow-farm" : ""}`
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            size="sm"
          >
            {!selectedDate ? (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Select Date First
              </>
            ) : !available ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Not Available
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
