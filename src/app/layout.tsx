import Image from "next/image";
import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import ReaderInitModal from "../components/ReaderInitModal";
import LogoutButton from "../components/LogoutButton";
import MobileNav from "../components/MobileNav";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeProvider } from "../contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Pleria Book Journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Book Journal</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=frame_inspect"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ThemeProvider>
          <div className="container">
            <div className="main-section">
              <nav className="main-nav hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="nav-container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="nav-logo flex items-center">
                    <Image
                      src="/images/logo.png"
                      alt="Pleria Logo"
                      width={118}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </div>
                  <ul className="nav-links flex justify-end items-center">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/books"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Books
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/readers"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Readers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <LogoutButton />
                    </li>
                    <li>
                      <ThemeToggle />
                    </li>
                  </ul>
                </div>
              </nav>

              <MobileNav />
              {children}
              <ReaderInitModal />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}