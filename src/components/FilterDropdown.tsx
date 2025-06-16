function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-4" data-testid="filter-dropdown-container">
      <label className="mr-2 font-medium text-left" data-testid="filter-dropdown-label">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 mr-2 text-black"
        data-testid="filter-dropdown-select"
      >
        <option value="" data-testid="filter-dropdown-all-option">
          All
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt} data-testid={`filter-dropdown-option-${idx}`}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterDropdown;