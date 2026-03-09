import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  CropPrice,
  PaymentMethod,
  Resource,
  UserProfile,
  WeatherData,
} from "../backend.d";
import type { ResourceType } from "../backend.d";
import { useActor } from "./useActor";

// ── Weather ──────────────────────────────────────────────────────────────
export function useWeatherData(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<WeatherData | null>({
    queryKey: ["weather", date],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getWeatherData(date);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Crop Prices ──────────────────────────────────────────────────────────
export function useAllCropPrices() {
  const { actor, isFetching } = useActor();
  return useQuery<CropPrice[]>({
    queryKey: ["cropPrices"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllCropPrices();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Resources ────────────────────────────────────────────────────────────
export function useResourcesByType(type: ResourceType) {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["resources", type],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getResourcesByType(type);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAllResources() {
  const { actor, isFetching } = useActor();
  return useQuery<Resource[]>({
    queryKey: ["resources", "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllResources();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useResourceAvailability(
  resourceId: bigint,
  date: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["availability", resourceId.toString(), date],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.getResourceAvailability(resourceId, date);
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching && enabled && !!date,
    staleTime: 30 * 1000,
  });
}

// ── Bookings ─────────────────────────────────────────────────────────────
export function useFarmerBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["farmerBookings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFarmerBookings();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    Booking,
    Error,
    { resourceId: bigint; bookingDate: string; paymentMethod: PaymentMethod }
  >({
    mutationFn: async ({ resourceId, bookingDate, paymentMethod }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.createBooking(resourceId, bookingDate, paymentMethod);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["farmerBookings"] });
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
      void queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error("Not connected");
      await actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["farmerBookings"] });
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

// ── User Profile ─────────────────────────────────────────────────────────
export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
