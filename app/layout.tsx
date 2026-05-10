import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookingHostel",
  description: "Find your perfect hostel stay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}