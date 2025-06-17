# Book Journal App

Book Journal is a full-stack web application that allows readers to track their reading progress, react to books, and view community feedback on shared reads. Users can create and manage their profiles, explore books, log their reading status (e.g., “In Progress”, “Finished”), rate them with stars and emojis, and write comments. It’s designed to make reading social, interactive, and insightful.

This app is ideal for book clubs or families sharing one device, where each person can have their own reading identity and track interactions with books over time.

---

## 💡 Design Decisions & Features

The application was built with a modular and scalable design. The backend is powered by **Express.js** with **PostgreSQL** using `pg-promise` for efficient database interactions. RESTful endpoints were built for three primary resources: `readers`, `books`, and `reviews`. The use of `ON CONFLICT` clauses in SQL enables seamless upserts for user interactions, like updating a reading status or adding a review without duplication.

On the frontend, we used **Next.js (App Router)** and **Tailwind CSS** to build a responsive, modern interface. Pages were split into reusable components like `BookDetailsModal`, `ModalForm`, and `LogoutButton` to promote clarity and reusability. State and effect logic are abstracted via **custom React hooks**, and all API interactions are centralized in a utility service for maintainability. When a user selects a book, the app checks if they’ve previously reviewed it and dynamically updates or creates a review based on their actions (e.g., “I’m Reading This”, “I Finished It”).

---

## 🧰 Technologies & Packages

- **Next.js (App Router)** – for server-side rendering and modern routing.
- **Tailwind CSS** – to streamline styling with utility-first CSS.
- **Express.js + pg-promise** – for building performant and SQL-injection-safe APIs with PostgreSQL.
- **Recharts** – used to visualize book review stats (reading statuses and rating distribution).
- **clsx** – for conditional className composition in components.

These tools were chosen for their strong community support, speed of development, and ability to maintain clarity in a project with both client and server responsibilities.

---


## 🔧 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/gilleon/book-journal
cd book-journal
```

Open [https://book-journal-nine.vercel.app/](https://book-journal-nine.vercel.app/) with your browser to see the result.