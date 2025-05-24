"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError(null)

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP. Please try again.")
      }

      // Success - show success message and prepare to redirect
      setSuccess(true)

      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#e6f5f0] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
          <h1 className="text-2xl font-semibold text-center mb-1">Forget Password?</h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Forgot your password? Please enter your email and we'll send you a 4-digit code.
          </p>

          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>OTP sent successfully! Redirecting you to verification page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-base font-medium mb-4">Enter your Personal Information</h2>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Write your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00A36C] bg-inherit"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A36C] text-white py-2 px-4 rounded-md hover:bg-[#00A36C]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
