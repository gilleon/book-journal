import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";

describe("Home Page", () => {
  it("renders main heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /book journal/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders navigation link to books collection", () => {
    render(<Home />);

    const booksLink = screen.getByRole("link", {
      name: /glance through our collection of book recommendations/i,
    });
    expect(booksLink).toBeInTheDocument();
    expect(booksLink).toHaveAttribute("href", "/books");
  });

  it("renders welcome text", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Book Journal");

    expect(
      screen.getByText(/welcome to your personal book journal/i)
    ).toBeInTheDocument();
  });
});
