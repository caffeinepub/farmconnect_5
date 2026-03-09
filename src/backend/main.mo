import Map "mo:core/Map";
import Order "mo:core/Order";
import Int "mo:core/Int";
import List "mo:core/List";
import Text "mo:core/Text";
import Error "mo:core/Error";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ResourceType = {
    #tractor;
    #labour;
    #drone;
  };

  public type PaymentMethod = {
    #online_upi;
    #offline_cash;
  };

  public type ResourceStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    locationLat : Float;
    locationLng : Float;
  };

  public type Resource = {
    id : Nat;
    resourceType : ResourceType;
    ownerName : Text;
    pricePerDay : Float;
    locationLat : Float;
    locationLng : Float;
    distanceKm : ?Float;
    description : Text;
    isAvailable : Bool;
  };

  public type Booking = {
    id : Nat;
    farmerId : Principal;
    resourceId : Nat;
    bookingDate : Text;
    paymentMethod : PaymentMethod;
    status : ResourceStatus;
    createdAt : Int;
  };

  public type WeatherData = {
    date : Text;
    temperature : Float;
    humidity : Float;
    rainfall : Float;
    condition : Text;
    windSpeed : Float;
  };

  public type CropPrice = {
    cropName : Text;
    pricePerQuintal : Float;
    unit : Text;
    date : Text;
    marketName : Text;
  };

  module Booking {
    public func compare(b1 : Booking, b2 : Booking) : Order.Order {
      Nat.compare(b1.id, b2.id);
    };
  };

  var nextResourceId = 1;
  var nextBookingId = 1;
  var nextProfileId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let resources = Map.empty<Nat, Resource>();
  let bookings = Map.empty<Nat, Booking>();
  let weather = Map.empty<Text, WeatherData>();
  let cropPrices = Map.empty<Text, CropPrice>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != user) {
      Runtime.trap("Unauthorized: Only admins or profile owners can get profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func addResource(resource : Resource) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };

    let resourceWithId = {
      resource with
      id = nextResourceId;
      distanceKm = null;
    };
    resources.add(nextResourceId, resourceWithId);
    nextResourceId += 1;
  };

  public query ({ caller }) func getResourcesByType(resourceType : ResourceType) : async [Resource] {
    resources.values().toArray().filter(
      func(r) { r.resourceType == resourceType }
    );
  };

  public query ({ caller }) func getAllResources() : async [Resource] {
    resources.values().toArray();
  };

  public shared ({ caller }) func createBooking(resourceId : Nat, bookingDate : Text, paymentMethod : PaymentMethod) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    switch (resources.get(resourceId)) {
      case (null) {
        Runtime.trap("Resource not found");
      };
      case (?resource) {
        if (not resource.isAvailable) {
          Runtime.trap("Resource is not available");
        };

        // Check for existing bookings
        for (b in bookings.values()) {
          if (b.resourceId == resourceId and b.bookingDate == bookingDate and b.status != #cancelled) {
            Runtime.trap("Resource already booked for this date");
          };
        };

        let newBooking : Booking = {
          id = nextBookingId;
          farmerId = caller;
          resourceId;
          bookingDate;
          paymentMethod;
          status = #pending;
          createdAt = Time.now();
        };

        bookings.add(nextBookingId, newBooking);
        nextBookingId += 1;
        newBooking;
      };
    };
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking not found");
      };
      case (?booking) {
        if (booking.farmerId != caller) {
          Runtime.trap("Unauthorized: Only the owner can cancel this booking");
        };
        let updatedBooking = {
          booking with
          status = #cancelled;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getFarmerBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get bookings");
    };

    bookings.values().toArray().filter(
      func(b) { b.farmerId == caller }
    );
  };

  public query ({ caller }) func getResourceAvailability(resourceId : Nat, date : Text) : async Bool {
    for (b in bookings.values()) {
      if (b.resourceId == resourceId and b.bookingDate == date and b.status != #cancelled) {
        return false;
      };
    };
    true;
  };

  public query ({ caller }) func getBooking(bookingId : Nat) : async ?Booking {
    switch (bookings.get(bookingId)) {
      case (null) { null };
      case (?booking) {
        if (caller != booking.farmerId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
  };

  public shared ({ caller }) func setWeatherData(weatherData : WeatherData) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set weather data");
    };
    weather.add(weatherData.date, weatherData);
  };

  public query ({ caller }) func getWeatherData(date : Text) : async WeatherData {
    switch (weather.get(date)) {
      case (null) { Runtime.trap("Weather data not found") };
      case (?weatherData) { weatherData };
    };
  };

  public shared ({ caller }) func setCropPrice(cropPrice : CropPrice) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set crop prices");
    };
    cropPrices.add(cropPrice.cropName # cropPrice.date, cropPrice);
  };

  public query ({ caller }) func getCropPrice(cropName : Text, date : Text) : async CropPrice {
    switch (cropPrices.get(cropName # date)) {
      case (null) { Runtime.trap("Crop price not found") };
      case (?cropPrice) { cropPrice };
    };
  };

  public query ({ caller }) func getAllCropPrices() : async [CropPrice] {
    cropPrices.values().toArray();
  };
};
