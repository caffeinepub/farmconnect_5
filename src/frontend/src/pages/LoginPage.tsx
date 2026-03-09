import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Leaf, Loader2, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // If already logged in, redirect
  if (isLoginSuccess || identity) {
    void navigate({ to: "/" });
    return null;
  }

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setSendingOtp(true);
    // Simulate OTP send
    await new Promise((r) => setTimeout(r, 1200));
    setSendingOtp(false);
    setStep("otp");
    toast.success(`OTP sent to +91 ${phone}`);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    setVerifying(true);
    // Mock OTP verification — accept any 4-6 digit code
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    if (otp === "1234" || otp.length >= 4) {
      toast.success("Login successful! Welcome to FarmConnect");
      // Use Internet Identity login as the auth mechanism
      login();
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top section */}
      <div className="farm-gradient pt-16 pb-12 px-6 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Leaf className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          FarmConnect
        </h1>
        <p className="text-white/80 text-base">
          Book tractors, labour & drones near you
        </p>
      </div>

      {/* Login card */}
      <div className="flex-1 px-4 -mt-6">
        <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm mx-auto border border-border">
          {step === "phone" ? (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">
                  Login to Continue
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Enter your phone number to get OTP
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center bg-muted border border-border rounded-lg px-3 text-sm font-semibold text-muted-foreground">
                    🇮🇳 +91
                  </div>
                  <Input
                    id="phone"
                    data-ocid="login.phone_input"
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="flex-1 text-base"
                    maxLength={10}
                    onKeyDown={(e) => e.key === "Enter" && void handleSendOtp()}
                  />
                </div>
              </div>

              <Button
                data-ocid="login.submit_button"
                onClick={() => void handleSendOtp()}
                disabled={sendingOtp || phone.length < 10}
                className="w-full farm-gradient text-white border-0 hover:opacity-90 py-6 font-semibold text-base"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Get OTP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">
                  Enter OTP
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  We sent a 6-digit code to +91 {phone}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Change
                  </button>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-semibold">
                  OTP Code
                </Label>
                <Input
                  id="otp"
                  type="number"
                  placeholder="Enter OTP (use 1234)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  className="text-center text-2xl font-bold tracking-widest py-6"
                  onKeyDown={(e) => e.key === "Enter" && void handleVerifyOtp()}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Demo: use any 4+ digit code
                </p>
              </div>

              <Button
                data-ocid="login.submit_button"
                onClick={() => void handleVerifyOtp()}
                disabled={verifying || otp.length < 4}
                className="w-full farm-gradient text-white border-0 hover:opacity-90 py-6 font-semibold text-base"
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Internet Identity / Google-style login */}
          <Button
            data-ocid="login.google_button"
            variant="outline"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full py-6 font-semibold border-2 hover:bg-muted transition-colors"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Continue with Internet Identity
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secure login via Internet Computer. No passwords needed.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
