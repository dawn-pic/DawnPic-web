'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Dawn Pic",
//   description: "A picture bed system based on Spring Boot",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full bg-orange-600">
          {/* <nav className="flex gap-3 max-w-screen-lg mx-auto text-orange-600 font-extrabold text-2xl h-[--header-height]">
          </nav> */}

          <main className="flex min-h-[100vh]">
            {children}
          </main>

          <footer className="flex flex-row bg-orange-200 font-extrabold items-center h-[--footer-height] text-orange-500">
            <p className="ml-10">Copyright © 2024 Dawn Pic</p>
            <a href="https://raw.githubusercontent.com/hanyujie2002/DawnPic/main/LICENSE" className="ml-3 hover:underline">MIT Licence</a>
            <p className="ml-auto">Powered by</p>
            <a href="https://nextjs.org/" className="hover:underline ml-1 mr-4">Nuxt.js</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
