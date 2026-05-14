"use client";

import React from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Cyber Background */}
      <div className="absolute inset-0 cyber-grid-bg" />
      <div className="absolute inset-0 cyber-scanline pointer-events-none" />

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-primary/20 bg-white p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
