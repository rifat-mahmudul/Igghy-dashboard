"use client";

import type React from "react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Create a separate component for the content that uses useSearchParams
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus on first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      setError(null);

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!email) {
      setError("Email not found. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            code: otpValue,
          }),
        }
      );

      const data = await response.json();


      if (response.ok) {
        router.push(
          `/reset-password?verified=true&userId=${encodeURIComponent(
            data?.data?.userId
          )}`
        );
      } else {
        // Handle API errors
        setError(
          data.message || "Invalid verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please try again.");
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        // Start cooldown
        setResendCooldown(60);
      } else {
        setError(data.message || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otp, isLoading]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
        <h1 className="text-2xl font-semibold text-center mb-1">
          Verify Email
        </h1>
        {email && (
          <p className="text-center text-gray-500 text-sm mb-6">
            {"We've sent a verification code to "}
            <span className="font-medium">{email}</span>
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-center text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isLoading}
              className={`w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent transition-all ${
                digit ? "bg-[#c2e6dc]" : "bg-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <p className="text-amber-600">{"Didn't receive OTP?"}</p>
          <button
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
            className="text-[#00A36C] hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend code"}
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full bg-[#00A36C] text-white py-3 px-4 rounded-md hover:bg-[#00A36C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-[#e6f5f0] min-h-screen flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="flex justify-between mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
