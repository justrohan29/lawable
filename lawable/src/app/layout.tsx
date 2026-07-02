import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Lawable - India's Legal Career Platform",
    template: "%s | Lawable",
  },
  description:
    "Lawable helps law students gain practical exposure through internships, mentorship, legal projects, skill development resources, and networking with legal professionals.",
  keywords: ["law internship", "legal career", "law student", "mentorship", "India law"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
