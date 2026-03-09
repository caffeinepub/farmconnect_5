import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CropPrice {
    marketName: string;
    pricePerQuintal: number;
    date: string;
    unit: string;
    cropName: string;
}
export interface WeatherData {
    temperature: number;
    date: string;
    windSpeed: number;
    humidity: number;
    rainfall: number;
    condition: string;
}
export interface Resource {
    id: bigint;
    locationLat: number;
    locationLng: number;
    ownerName: string;
    isAvailable: boolean;
    description: string;
    pricePerDay: number;
    distanceKm?: number;
    resourceType: ResourceType;
}
export interface Booking {
    id: bigint;
    status: ResourceStatus;
    paymentMethod: PaymentMethod;
    farmerId: Principal;
    resourceId: bigint;
    createdAt: bigint;
    bookingDate: string;
}
export interface UserProfile {
    locationLat: number;
    locationLng: number;
    name: string;
    phone: string;
}
export enum PaymentMethod {
    offline_cash = "offline_cash",
    online_upi = "online_upi"
}
export enum ResourceStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum ResourceType {
    labour = "labour",
    tractor = "tractor",
    drone = "drone"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addResource(resource: Resource): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBooking(bookingId: bigint): Promise<void>;
    createBooking(resourceId: bigint, bookingDate: string, paymentMethod: PaymentMethod): Promise<Booking>;
    getAllCropPrices(): Promise<Array<CropPrice>>;
    getAllResources(): Promise<Array<Resource>>;
    getBooking(bookingId: bigint): Promise<Booking | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCropPrice(cropName: string, date: string): Promise<CropPrice>;
    getFarmerBookings(): Promise<Array<Booking>>;
    getResourceAvailability(resourceId: bigint, date: string): Promise<boolean>;
    getResourcesByType(resourceType: ResourceType): Promise<Array<Resource>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeatherData(date: string): Promise<WeatherData>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCropPrice(cropPrice: CropPrice): Promise<void>;
    setWeatherData(weatherData: WeatherData): Promise<void>;
}
