# FarmConnect

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- **Authentication**: Login via phone number (OTP-based) or Google account
- **Tractor Booking**: Browse and book tractors available within 25 km radius; exclusive booking (once booked for a day, no other farmer can book)
- **Labour Booking**: Browse and book farm labourers available within 25 km radius; exclusive daily booking
- **Drone Booking**: Browse and book agricultural drones for spraying/surveying; exclusive daily booking
- **Availability System**: Each resource (tractor, labour, drone) has a daily availability calendar; once booked, marked unavailable for that day
- **Payment Integration**: Online payment via PhonePe / Google Pay (UPI deep links); offline payment option (pay at site / cash)
- **Weather Updates**: Daily weather forecast display (temperature, rain, humidity) using a weather data source
- **Crop Price Updates**: Daily market prices for major crops (rice, wheat, cotton, sugarcane, etc.)
- **Farmer Dashboard**: Overview of upcoming bookings, weather, and crop prices
- **Booking History**: List of past and upcoming bookings for the logged-in farmer
- **Resource Listings**: Cards showing tractors, labourers, and drones with name, distance, price/day, and availability status

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Backend actor with:
   - User profiles (phone/Google login identity)
   - Resource types: Tractor, Labour, Drone (with location, price, owner)
   - Booking records with date, resource ID, farmer ID, payment method, status
   - Availability check: reject booking if resource already booked for that date
   - Daily weather data store (mock data, updatable)
   - Daily crop price store (mock data, updatable)
   - CRUD for bookings, resources, weather, crop prices

2. Frontend pages:
   - Login page (phone OTP or Google sign-in)
   - Home/Dashboard (weather widget, crop prices, quick booking links)
   - Tractor Booking page (list with distance filter, availability calendar, booking form)
   - Labour Booking page (same pattern)
   - Drone Booking page (same pattern)
   - Payment page (UPI QR/deep link for PhonePe/Google Pay, or offline option)
   - My Bookings page (upcoming + history)
   - Crop Prices page (table of daily crop prices)
   - Weather page (detailed daily forecast)
