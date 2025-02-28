import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { CartProvider } from "@/components/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className="font-primary">
          <CartProvider>
            {children}
            <ToastContainer
              autoClose={2000}
              className="text-sm font-medium"
              position="top-right"
            />
          </CartProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
