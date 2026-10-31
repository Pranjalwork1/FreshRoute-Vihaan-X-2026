import type { Metadata } from "next";
import "./globals.css";
import { LocationProvider } from "@/lib/hooks/useDeliveryLocation";

export const metadata: Metadata = {
  title: "FreshRoute: from surplus to opportunity",
  description:
    "FreshRoute connects farmers, local vendors, retailers, wholesalers and logistics providers to rescue surplus perishable produce before it loses commercial value.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocationProvider>{children}</LocationProvider>
      </body>
    </html>
  );
}
