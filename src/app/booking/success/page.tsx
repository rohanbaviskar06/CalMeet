"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Calendar, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmCustomPaymentBooking } from "@/app/actions/bookings";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("razorpay_payment_id") || "";
  const bookingId = searchParams.get("razorpay_payment_link_reference_id") || "";
  
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    bookingId && paymentId ? "loading" : "success"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function verify() {
      if (bookingId && paymentId) {
        try {
          const res = await confirmCustomPaymentBooking(bookingId, paymentId);
          if (res.success) {
            setStatus("success");
          } else {
            setStatus("error");
            setErrorMsg(res.error || "Could not confirm booking.");
          }
        } catch (err) {
          setStatus("error");
          setErrorMsg("An unexpected verification error occurred.");
        }
      }
    }
    verify();
  }, [bookingId, paymentId]);

  if (status === "loading") {
    return (
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-455">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Confirming Payment...</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Please wait while we secure your slot and finalize your appointment details.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans">Verification Failed</h1>
          <p className="text-sm text-rose-500 font-medium">
            {errorMsg}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            If you completed the payment, please contact the meeting host directly with your payment reference ID.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/" passHref className="w-full block">
            <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-250 transition-colors font-medium">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
        <Check className="h-8 w-8" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Booking Confirmed!</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your payment was successful and the meeting has been scheduled.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 text-left space-y-3">
        <div className="flex items-start gap-3 text-sm text-zinc-650 dark:text-zinc-305">
          <Calendar className="h-4.5 w-4.5 text-zinc-450 dark:text-zinc-500 mt-0.5" />
          <div>
            <p className="font-semibold">Invitation Sent</p>
            <p className="text-xs text-zinc-550 dark:text-zinc-450 mt-0.5 leading-relaxed">
              Check your email inbox for the calendar event details and Google Meet link.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Link href="/" passHref className="w-full block">
          <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-250 transition-colors font-medium">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-455">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Loading page...</h1>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
