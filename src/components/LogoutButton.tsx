"use client";

export default function LogoutButton() {
  function handleLogout() {
    localStorage.removeItem("reader");
    window.location.reload();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        padding: 0,
        font: "inherit",
      }}
    >
      Log out
    </button>
  );
}
