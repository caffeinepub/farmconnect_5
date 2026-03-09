import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, MapPin, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerUserProfile, useSaveUserProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerUserProfile();
  const saveProfile = useSaveUserProfile();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lat, setLat] = useState("28.6145");
  const [lng, setLng] = useState("77.2090");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setLat(profile.locationLat?.toString() || "28.6145");
      setLng(profile.locationLng?.toString() || "77.2090");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        locationLat: Number.parseFloat(lat) || 28.6145,
        locationLng: Number.parseFloat(lng) || 77.209,
      });
      toast.success("Profile saved successfully!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save profile");
    }
  };

  const handleLogout = () => {
    clear();
    void navigate({ to: "/login" });
    toast.success("Logged out successfully");
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "F";

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
    : "Not connected";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="farm-gradient px-4 pt-8 pb-20 text-center">
        <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-white/30">
          <AvatarFallback className="bg-white/20 text-white font-display font-bold text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-display font-bold text-2xl text-white">
          {name || "Your Profile"}
        </h1>
        {identity && (
          <p className="text-white/60 text-xs mt-1 font-mono">
            {shortPrincipal}
          </p>
        )}
      </div>

      <div className="px-4 -mt-8 max-w-lg mx-auto space-y-4">
        {/* Profile Form */}
        <Card className="border-border">
          <CardContent className="p-5 space-y-4">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h2>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center bg-muted border border-border rounded-lg px-3 text-sm font-semibold text-muted-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="flex-1 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Your Location (Lat/Lng)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Used to find resources within 25 km of you
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Latitude
                      </Label>
                      <Input
                        type="number"
                        placeholder="28.6145"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        step="0.0001"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Longitude
                      </Label>
                      <Input
                        type="number"
                        placeholder="77.2090"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        step="0.0001"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => void handleSave()}
                  disabled={saveProfile.isPending}
                  className="w-full farm-gradient text-white border-0 hover:opacity-90 py-6 font-semibold"
                >
                  {saveProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account section */}
        {identity && (
          <Card className="border-border">
            <CardContent className="p-5">
              <h2 className="font-display font-bold text-foreground mb-4">
                Account
              </h2>
              <div className="bg-muted/50 rounded-xl p-3 mb-4">
                <p className="text-xs text-muted-foreground font-medium">
                  Internet Identity Principal
                </p>
                <p className="font-mono text-xs text-foreground mt-1 break-all">
                  {principal}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/5 hover:border-destructive py-6"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        )}

        {!identity && (
          <Card className="border-border">
            <CardContent className="p-5 text-center">
              <p className="text-muted-foreground text-sm mb-3">
                Login to save your profile and make bookings
              </p>
              <Button
                onClick={() => void navigate({ to: "/login" })}
                className="farm-gradient text-white border-0 hover:opacity-90 w-full py-6"
              >
                Login to FarmConnect
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
