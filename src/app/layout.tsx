import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "On The Docket - Content Manager",
  description: "Supreme Court content management and publishing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
