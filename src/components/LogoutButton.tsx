"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LogoutButton() {
  const [readerExists, setReaderExists] = useState(false);

  useEffect(() => {
    const reader = localStorage.getItem("reader");
    setReaderExists(!!reader);
  }, []);

  function handleLogout() {
    localStorage.removeItem("reader");
    window.location.reload();
  }

  if (!readerExists) {
    return null;
  }

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
    >
      Log out
    </Link>
  );
}
