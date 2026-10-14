"use client";

import React from "react";

// Styled wrapper for search input

type CategorySelectProps = {
  cats: string[];
  onChange: (key: string, value: string) => void;
  ariaLabel?: string;
  $className?: string;
  placeholder?: string;
};

/**
 * Reusable search input component.
 * Provides a styled input field with search functionality.
 */
function CategorySelect({
  $className,
  cats,
  onChange,
  ariaLabel,
  placeholder,
}: CategorySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange("binOption", e.target.value);
  };
  return (
    <div className={$className}>
      <label htmlFor="category">Category</label>
      <select
        id="category"
        defaultValue=""
        aria-label={ariaLabel}
        onChange={handleChange}
      >
        <option value="">{placeholder}</option>
        {cats.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelect;
