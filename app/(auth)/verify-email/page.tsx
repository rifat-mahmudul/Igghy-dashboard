"use client"

import type React from "react"

import { useState, useRef, useEffect, Suspense } from "react" // Import Suspense
import { useSearchParams } from "next/navigation"

// Create a separate component for the content that uses useSearchParams
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "abcdef@gmail.com"
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus on first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]!.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]!.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus()
      }
    }
  }

  const handleVerify = () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    // Verify OTP logic here
    // For demo purposes, showing error state
    setError("Your OTP is Wrong!")
  }

  const handleResend = () => {
    // Resend OTP logic here
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
        <h1 className="text-2xl font-semibold text-center mb-1">Verify Email</h1>
        {email && <p className="text-center text-gray-500 text-sm mb-6">We've sent a verification code to {email}</p>}

        {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}

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
              className={`w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00A36C] ${
                digit ? "bg-[#c2e6dc]" : "bg-inherit"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <p className="text-amber-500">Didn't receive OTP?</p>
          <button onClick={handleResend} className="text-[#00A36C] hover:underline">
            Resend code
          </button>
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-[#00A36C] text-white py-2 px-4 rounded-md hover:bg-[#00A36C]/90 transition-colors"
        >
          Verify
        </button>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-[#e6f5f0] h-screen flex items-center justify-center">
      {/* Wrap the content that uses useSearchParams with Suspense */}
      <Suspense fallback={<div>Loading email...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}