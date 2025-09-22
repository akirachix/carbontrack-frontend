import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
const nunito = Nunito({
  subsets: ["latin"],
  weight: [
    "200", "300", "400", "600", "700", "800", "900"
  ],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Carbon Track",
  description: "Real-time CO2 monitoring web portal for KTDA tea factories",
  // icons: {
  //   icon: '/favicon.ico',
  // },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        
        {children}
      </body>
    </html>
  );
}