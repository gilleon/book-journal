import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterDropdown from "../FilterDropdown";

describe("FilterDropdown", () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: "Test Filter",
    options: ["Option 1", "Option 2", "Option 3"],
    value: "",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders container using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} />);

    const container = screen.getByTestId("filter-dropdown-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("mb-4");
  });

  it("renders label using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} />);

    const label = screen.getByTestId("filter-dropdown-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Test Filter");
  });

  it("renders select element using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} />);

    const select = screen.getByTestId("filter-dropdown-select");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it('renders "All" option using getByTestId', () => {
    render(<FilterDropdown {...defaultProps} />);

    const allOption = screen.getByTestId("filter-dropdown-all-option");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveTextContent("All");
    expect(allOption).toHaveValue("");
  });

  it("renders all custom options using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} />);

    const option0 = screen.getByTestId("filter-dropdown-option-0");
    const option1 = screen.getByTestId("filter-dropdown-option-1");
    const option2 = screen.getByTestId("filter-dropdown-option-2");

    expect(option0).toHaveTextContent("Option 1");
    expect(option1).toHaveTextContent("Option 2");
    expect(option2).toHaveTextContent("Option 3");
  });

  it("calls onChange when selection changes using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} />);

    const select = screen.getByTestId("filter-dropdown-select");
    fireEvent.change(select, { target: { value: "Option 1" } });

    expect(mockOnChange).toHaveBeenCalledWith("Option 1");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("displays the correct selected value using getByTestId", () => {
    render(<FilterDropdown {...defaultProps} value="Option 2" />);

    const select = screen.getByTestId("filter-dropdown-select");
    expect(select).toHaveValue("Option 2");
  });
});
