import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/components/GlobalLoading/LoadingContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
  export const metadata: Metadata = {
    title: "Kaito Kit",
    description: "Blog chia sẻ kiến thức, kinh nghiệm và những câu chuyện thú vị về công nghệ, cuộc sống.",
    icons: {
      icon: "/tile_1.png",
      shortcut: "/tile_1.png",
      apple: "/tile_1.png",
    },
  };
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text`}
            >
                <LoadingProvider>
                    {children}
                </LoadingProvider>
                <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </body>
        </html>
    )
}