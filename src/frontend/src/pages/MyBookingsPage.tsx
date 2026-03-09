import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  IndianRupee,
  Loader2,
  Plane,
  Tractor,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend.d";
import { PaymentMethod, ResourceStatus, ResourceType } from "../backend.d";
import { mockDrones, mockLabours, mockTractors } from "../data/mockData";
import {
  useAllResources,
  useCancelBooking,
  useFarmerBookings,
} from "../hooks/useQueries";

const allMockResources = [...mockTractors, ...mockLabours, ...mockDrones];

function getResourceIcon(type?: ResourceType) {
  switch (type) {
    case ResourceType.tractor:
      return <Tractor className="h-4 w-4" />;
    case ResourceType.labour:
      return <Users className="h-4 w-4" />;
    case ResourceType.drone:
      return <Plane className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
}

function getStatusBadge(status: ResourceStatus) {
  switch (status) {
    case ResourceStatus.confirmed:
      return (
        <Badge variant="outline" className="status-available">
          ✓ Confirmed
        </Badge>
      );
    case ResourceStatus.pending:
      return (
        <Badge variant="outline" className="status-pending">
          ⏳ Pending
        </Badge>
      );
    case ResourceStatus.cancelled:
      return (
        <Badge variant="outline" className="status-booked">
          ✗ Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function BookingCard({
  booking,
  index,
  allResources,
  showCancel,
}: {
  booking: Booking;
  index: number;
  allResources: typeof allMockResources;
  showCancel: boolean;
}) {
  const [cancelling, setCancelling] = useState(false);
  const cancelBooking = useCancelBooking();

  const resource =
    allResources.find((r) => r.id === booking.resourceId) ||
    allMockResources.find((r) => r.id === booking.resourceId);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking.mutateAsync(booking.id);
      toast.success("Booking cancelled successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const formattedDate = (() => {
    try {
      return new Date(booking.bookingDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return booking.bookingDate;
    }
  })();

  return (
    <Card
      className="border-border overflow-hidden"
      data-ocid={`bookings.item.${index}`}
    >
      <CardContent className="p-0">
        <div
          className={`h-1 ${booking.status === ResourceStatus.cancelled ? "bg-destructive" : "farm-gradient"}`}
        />
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {getResourceIcon(resource?.resourceType)}
              </div>
              <div>
                <p className="font-display font-bold text-sm text-foreground">
                  {resource?.ownerName ||
                    `Resource #${booking.resourceId.toString()}`}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {resource?.description || "Service booking"}
                </p>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>
                {booking.paymentMethod === PaymentMethod.online_upi
                  ? "UPI Payment"
                  : "Cash on Day"}
              </span>
            </div>
          </div>

          {/* Cancel */}
          {showCancel && booking.status !== ResourceStatus.cancelled && (
            <Button
              data-ocid={`bookings.cancel_button.${index}`}
              variant="outline"
              size="sm"
              onClick={() => void handleCancel()}
              disabled={cancelling}
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/5 hover:border-destructive"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyBookingsPage() {
  const { data: bookings, isLoading } = useFarmerBookings();
  const { data: allResources } = useAllResources();

  const resources =
    allResources && allResources.length > 0 ? allResources : allMockResources;
  const allBookings = bookings || [];

  const today = new Date().toISOString().split("T")[0];
  const upcoming = allBookings.filter(
    (b) => b.bookingDate >= today && b.status !== ResourceStatus.cancelled,
  );
  const past = allBookings.filter(
    (b) => b.bookingDate < today || b.status === ResourceStatus.cancelled,
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="farm-gradient px-4 pt-6 pb-14">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📋</span>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                My Bookings
              </h1>
              <p className="text-white/80 text-sm">
                Track all your service bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 max-w-lg mx-auto">
        <Tabs defaultValue="upcoming">
          <TabsList className="w-full mb-4 bg-card border border-border">
            <TabsTrigger
              data-ocid="bookings.tab"
              value="upcoming"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Past {past.length > 0 && `(${past.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="bookings.empty_state"
              >
                <span className="text-5xl">📭</span>
                <p className="font-display font-bold text-lg text-foreground mt-3">
                  No Upcoming Bookings
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Book a tractor, labour, or drone to get started
                </p>
              </div>
            ) : (
              upcoming.map((booking, i) => (
                <BookingCard
                  key={booking.id.toString()}
                  booking={booking}
                  index={i + 1}
                  allResources={resources}
                  showCancel={true}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : past.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl">📜</span>
                <p className="font-display font-bold text-lg text-foreground mt-3">
                  No Past Bookings
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Your booking history will appear here
                </p>
              </div>
            ) : (
              past.map((booking, i) => (
                <BookingCard
                  key={booking.id.toString()}
                  booking={booking}
                  index={i + 1}
                  allResources={resources}
                  showCancel={false}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
