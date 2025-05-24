"use client"; // Keep this if you have other client-side logic in this page.
              // If this page is solely a server component wrapper, you can remove it.

import React, { Suspense } from "react";
import ResetPasswordForm from "./_component/reset-pass"; // Adjust path as needed

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}