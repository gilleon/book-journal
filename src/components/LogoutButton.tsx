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
      style={{
        color: "inherit",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      Log out
    </Link>
  );
}
