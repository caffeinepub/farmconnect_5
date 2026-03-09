import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";
import { PaymentMethod } from "../backend.d";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
  resourceName: string;
  amount: number;
  bookingDate: string;
}

export function PaymentModal({
  open,
  onClose,
  onConfirm,
  resourceName,
  amount,
  bookingDate,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.online_upi);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(method);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setMethod(PaymentMethod.online_upi);
    onClose();
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm mx-auto" data-ocid="payment.dialog">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {resourceName} booked for {bookingDate}
              </p>
            </div>
            <Badge variant="outline" className="status-available px-4 py-1">
              {method === PaymentMethod.online_upi
                ? "UPI Payment Initiated"
                : "Pay Cash on Day of Service"}
            </Badge>
            <Button
              onClick={handleClose}
              className="w-full farm-gradient text-white border-0"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto" data-ocid="payment.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Choose Payment Method
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {resourceName} · {bookingDate} ·{" "}
            <span className="font-semibold text-foreground">₹{amount}/day</span>
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Online UPI */}
          <button
            type="button"
            data-ocid="payment.online_button"
            onClick={() => setMethod(PaymentMethod.online_upi)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              method === PaymentMethod.online_upi
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">
                Pay Online (UPI)
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                PhonePe, Google Pay, or any UPI app
              </div>
              {method === PaymentMethod.online_upi && (
                <div className="flex gap-2 mt-3">
                  <a
                    href={`phonepe://pay?pa=farmconnect@ybl&pn=FarmConnect&am=${amount}&cu=INR&tn=FarmBooking`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#5f259f] text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>📱</span> PhonePe
                  </a>
                  <a
                    href={`tez://upi/pay?pa=farmconnect@okaxis&pn=FarmConnect&am=${amount}&cu=INR&tn=FarmBooking`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a73e8] text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>G</span> GPay
                  </a>
                </div>
              )}
            </div>
          </button>

          {/* Offline Cash */}
          <button
            type="button"
            data-ocid="payment.offline_button"
            onClick={() => setMethod(PaymentMethod.offline_cash)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              method === PaymentMethod.offline_cash
                ? "border-farm-amber bg-farm-amber/10"
                : "border-border hover:border-farm-amber/40"
            }`}
          >
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Pay Cash</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Pay on the day of service
              </div>
              {method === PaymentMethod.offline_cash && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                  💵 Keep ₹{amount} ready to pay directly to the service
                  provider
                </div>
              )}
            </div>
          </button>
        </div>

        <DialogFooter className="flex gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="payment.cancel_button"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            data-ocid="payment.confirm_button"
            className="flex-1 farm-gradient text-white border-0 hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
