import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Resource } from "../backend.d";
import { type PaymentMethod, ResourceType } from "../backend.d";
import { PaymentModal } from "../components/PaymentModal";
import { ResourceCard } from "../components/ResourceCard";
import { mockDrones, mockLabours, mockTractors } from "../data/mockData";
import { useCreateBooking, useResourcesByType } from "../hooks/useQueries";

interface ResourceBookingPageProps {
  type: ResourceType;
}

const config = {
  [ResourceType.tractor]: {
    title: "Book a Tractor",
    emoji: "🚜",
    scopePrefix: "tractors",
    searchPlaceholder: "Search tractors by owner...",
    emptyMessage: "No tractors available nearby",
  },
  [ResourceType.labour]: {
    title: "Book Labour",
    emoji: "👨‍🌾",
    scopePrefix: "labours",
    searchPlaceholder: "Search labourers by name...",
    emptyMessage: "No labourers available nearby",
  },
  [ResourceType.drone]: {
    title: "Book a Drone",
    emoji: "🚁",
    scopePrefix: "drones",
    searchPlaceholder: "Search drones by service...",
    emptyMessage: "No drones available nearby",
  },
};

const fallbackData = {
  [ResourceType.tractor]: mockTractors,
  [ResourceType.labour]: mockLabours,
  [ResourceType.drone]: mockDrones,
};

export function ResourceBookingPage({ type }: ResourceBookingPageProps) {
  const { title, emoji, scopePrefix, searchPlaceholder, emptyMessage } =
    config[type];
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingResource, setBookingResource] = useState<Resource | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const { data: resources, isLoading } = useResourcesByType(type);
  const createBooking = useCreateBooking();

  const allResources =
    resources && resources.length > 0 ? resources : fallbackData[type];

  const filtered = allResources.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.ownerName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  const handleBook = (resource: Resource) => {
    if (!selectedDate) {
      toast.error("Please select a booking date first");
      return;
    }
    setBookingResource(resource);
    setPaymentOpen(true);
  };

  const handleConfirmBooking = async (method: PaymentMethod) => {
    if (!bookingResource) return;
    try {
      await createBooking.mutateAsync({
        resourceId: bookingResource.id,
        bookingDate: selectedDate,
        paymentMethod: method,
      });
      toast.success("Booking confirmed successfully!");
      setPaymentOpen(false);
      setBookingResource(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Booking failed";
      if (
        msg.toLowerCase().includes("already booked") ||
        msg.toLowerCase().includes("not available")
      ) {
        toast.error(
          "This resource is already booked for the selected date. Please choose another date.",
        );
      } else {
        toast.error(msg);
      }
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="farm-gradient px-4 pt-6 pb-14">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                {title}
              </h1>
              <p className="text-white/80 text-sm">
                Within 25 km of your location
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 max-w-lg mx-auto space-y-4">
        {/* Date + Search */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Select Booking Date
            </Label>
            <Input
              data-ocid={`${scopePrefix}.date_input`}
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              Search
            </Label>
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Booking note */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Once booked, this resource is exclusively reserved for you on the
            selected date. No one else can book it.
          </p>
        </div>

        {/* Resources count */}
        {!isLoading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}{" "}
              found
            </p>
            <div className="flex gap-1">
              <Badge variant="outline" className="status-available text-xs">
                {filtered.filter((r) => r.isAvailable).length} Available
              </Badge>
              <Badge variant="outline" className="status-booked text-xs">
                {filtered.filter((r) => !r.isAvailable).length} Booked
              </Badge>
            </div>
          </div>
        )}

        {/* Resource list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12"
            data-ocid={`${scopePrefix}.empty_state`}
          >
            <span className="text-5xl">{emoji}</span>
            <p className="font-display font-bold text-lg text-foreground mt-3">
              {emptyMessage}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search or date
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((resource, i) => (
              <ResourceCard
                key={resource.id.toString()}
                resource={resource}
                index={i + 1}
                scopePrefix={scopePrefix}
                selectedDate={selectedDate}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {bookingResource && (
        <PaymentModal
          open={paymentOpen}
          onClose={() => {
            setPaymentOpen(false);
            setBookingResource(null);
          }}
          onConfirm={handleConfirmBooking}
          resourceName={bookingResource.ownerName}
          amount={bookingResource.pricePerDay}
          bookingDate={selectedDate}
        />
      )}
    </div>
  );
}
