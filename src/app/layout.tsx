import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to my portfolio!",
  description: "",
  openGraph: {
    title: 'Welcome to my portfolio!',
    description: 'Hire me !',
    url: 'alexandreribeiro.xyz',
    siteName: 'Alexandre Ribeiro | Hire me',
    images: [
      {
        url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Graves_0.jpg',
        width: 1215,
        height: 717,
      }
      
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {children}
        
      </body>
    </html>
  );
}
