import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import About from "../page";

describe("About Page", () => {
  it("renders heading using getByTitle", () => {
    render(<About />);

    const heading = screen.getByTitle("About Book Journal Heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("About Book Journal");
  });

  it("renders description using getByTitle", () => {
    render(<About />);

    const description = screen.getByTitle("Book Journal Description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(/book journal is a simple app/i);
  });
});