"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get userId from URL params (typically from reset token)
    const userIdParam = searchParams.get("userId") || searchParams.get("token");
    if (userIdParam) {
      setUserId(userIdParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePasswords()) {
      return;
    }

    if (!userId) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while resetting your password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#e6f5f0] h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8 text-center">
            <CheckCircle className="h-16 w-16 text-[#00A36C] mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Your password has been successfully reset.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e6f5f0] h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#ebf7f3] rounded-lg border border-[#00A36C] p-8">
          <h1 className="text-2xl font-semibold text-center mb-1">
            Reset Password
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Create your password
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-base font-medium mb-4">
                Create a new password
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Set new Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00A36C] bg-inherit"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00A36C] bg-inherit"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isLoading || !newPassword || !confirmPassword || !userId
              }
              className="w-full bg-[#00A36C] text-white py-2 px-4 rounded-md hover:bg-[#00A36C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}