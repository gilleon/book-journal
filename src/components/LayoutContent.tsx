'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ReaderInitModal from "./ReaderInitModal";
import LogoutButton from "./LogoutButton";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/books', label: 'Books' },
    { href: '/readers', label: 'Readers' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="container">
      <div className="main-section">
        <nav className="main-nav hidden lg:block bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="nav-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="nav-logo flex items-center">
              <Logo />
            </div>
            <ul className="nav-links flex justify-end items-center space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md relative ${
                      isActive(link.href)
                        ? "text-blue-400 dark:text-gray-50 bg-blue-50 dark:bg-green-700 border-b-2 border-gray-300 dark:border-blue-50 [&:has(:hover)>*:not(:hover)]:scale-95"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
        <ReaderInitModal />
      </div>
    </div>
  );
}