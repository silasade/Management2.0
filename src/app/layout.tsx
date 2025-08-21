import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Provider from "./_global_components/Contexts/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Management2.0",
  description: "Smart Event Organizer: AI-Driven Image-to-Calendar Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={` antialiased`}>
        <Provider>
          <ToastContainer />
          {children}
        </Provider>
      </body>
    </html>
  );
}
