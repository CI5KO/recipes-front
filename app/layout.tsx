import type { Metadata, Viewport } from "next";
import "../src/styles/globals.css";
import ServiceWorkerRegistration from "../src/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Cooking Cat",
  description: "Cooking Cat app",
  icons: {
    icon: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cooking Cat",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-primary dark:bg-primary-dark">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
