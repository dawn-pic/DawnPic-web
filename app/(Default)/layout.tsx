"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link"
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Dawn Pic",
//   description: "A picture bed system based on Spring Boot",
// };

type UserStatus = {
  loggedIn: boolean;
  user?: { username: string };
  message?: string;
}

const checkIfUserLoggedIn = async (): Promise<UserStatus> => {
  try {
    const response = await fetch('/api/user/current-user');
    if (response.ok) {
      const user = await response.json();
      return {
        loggedIn: true,
        user: user
      }
    } else if (response.status === 401) {
      return {
        loggedIn: false,
        message: 'User details not found'
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return {
      loggedIn: false,
      message: 'An unexpected error occurred'
    }
  }

  return {
    loggedIn: false,
    message: 'Unknown error'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userStatus, setUserStatus] = useState<UserStatus>({ loggedIn: false });

  useEffect(()=> {
    const fetchUserStatus = async () => {
      const status = await checkIfUserLoggedIn();
      setUserStatus(status);
    }

    fetchUserStatus();
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="w-full bg-orange-600">
          <nav className="flex gap-3 mx-auto text-orange-600 font-extrabold text-2xl h-[--header-height]" style={{ maxWidth: "min(1024px, calc(100vw - 1.5rem))" }}>
            {userStatus.loggedIn ? (
              <>
                <p className="ml-auto p-1 text-orange-200">Welcome, {userStatus.user?.username}</p>
                <button className="flex mb-auto p-1 transition-all bg-orange-300 rounded-b hover:pt-2 shadow hover:shadow-lg"><Link href="/images">My images</Link></button>
              </>
            ) : (
              <>
                <button className="flex ml-auto mb-auto p-1 transition-all bg-orange-300 rounded-b hover:pt-2 shadow hover:shadow-lg"><Link href="/signup">Sign Up</Link></button>
                <button className="flex mr-2 mb-auto p-1 transition-all bg-orange-300 rounded-b hover:pt-2 shadow hover:shadow-lg"><Link href="/signin">Sign In</Link></button>
              </>
            )}
          </nav>

          <main className="flex items-center justify-center min-h-[calc(100vh-var(--footer-height))]">
            {children}
          </main>

          <footer className="flex flex-col sm:flex-row bg-orange-200 font-extrabold items-center sm:h-[--footer-height] text-orange-500">
            <p className="sm:ml-10">Copyright © 2024 Dawn Pic</p>
            <a href="https://raw.githubusercontent.com/hanyujie2002/DawnPic/main/LICENSE" className="sm:ml-3 hover:underline">MIT Licence</a>
            <div className="sm:ml-auto flex flex-row">
              <p className="content-center">Powered by</p>
              <a href="https://nextjs.org/" className="hover:underline ml-1 sm:mr-4">Nuxt.js</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
