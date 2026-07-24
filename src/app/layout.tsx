import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartDrawerProvider } from "@/context/CartDrawerContext";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cloudnin3 — Premium Contemporary Modest Fashion",
  description: "Premium contemporary modest fashion for the modern woman. Effortless elegance, architectural silhouettes, and timeless design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-inter antialiased">
        <AuthSessionProvider>
          <CartProvider>
          <CartDrawerProvider>
          {children}
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#FFFFFF",
                color: "#10151C",
                border: "1px solid #E5E5E7",
              },
            }}
          />
          </CartDrawerProvider>
          </CartProvider>
        </AuthSessionProvider>
        </body>
    </html>
  );
}
