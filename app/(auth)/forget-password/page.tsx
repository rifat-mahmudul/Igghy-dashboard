"use client"

import type React from "react"

import { useState } from "react"

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle send OTP logic here
  }

  return (
    <div className="bg-[#e6f5f0] h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
          <h1 className="text-2xl font-semibold text-center mb-1">Forget Password?</h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Forgot your password? Please enter your email and we'll send you a 4-digit code.
          </p>

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
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00A36C] text-white py-2 px-4 rounded-md hover:bg-[#00A36C]/90 transition-colors"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
