import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Soko Africa - Authentic African Products | Global Marketplace",
  description: "Discover authentic African products from across the continent. Shop handcrafted goods, textiles, coffee, and more. Supporting African artisans and businesses worldwide.",
  keywords: "African products, handcrafted goods, African textiles, coffee, authentic, marketplace, artisans, fair trade",
  openGraph: {
    title: "Soko Africa - Authentic African Products",
    description: "Discover authentic African products from across the continent",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
