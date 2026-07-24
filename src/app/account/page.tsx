"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Loader";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (status === "unauthenticated" || !session) {
    router.push("/auth/login");
    return null;
  }

  const user = session.user;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="py-12 md:py-16 border-b border-light-gray/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-2">Account</p>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-deep-navy">
              My Account
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
          <div className="p-6 mb-6 border border-light-gray/50">
            <div className="flex items-center gap-4 mb-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="w-14 h-14 object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-cool-ivory flex items-center justify-center">
                  <span className="text-lg font-playfair font-bold text-deep-navy">
                    {(user.name || user.email || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-base font-playfair font-semibold text-deep-navy">
                  {user.name || "Customer"}
                </h2>
                <p className="text-mid-gray text-xs">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-light-gray/50">
                <p className="text-[10px] text-mid-gray uppercase tracking-wider">Orders</p>
                <p className="text-xl font-bold text-deep-navy">0</p>
              </div>
            </div>

            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
