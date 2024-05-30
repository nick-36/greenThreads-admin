import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "500"] });

export const metadata: Metadata = {
  title: "Green Threads Seller",
  description: "Green Threads Seller",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a client
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
