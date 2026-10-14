"use client";

import React from "react";
import Button from "../shared/Button";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  $className?: string;
};

/**
 * Reusable search input component.
 * Provides a styled input field with search functionality.
 */
function SearchInput({
  $className,
  value,
  onChange,
  placeholder = "Search for an item...",
  ariaLabel = "Search items",
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearSearch = () => {
    onChange("");
  };

  return (
    <div className={$className}>
      <label htmlFor="search-input">Search:</label>
      <div className=" flex-row gap-2">
        <input
          name="search-input"
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel}
          className="flex-1"
        />
        {value ? (
          <Button
            onClick={() => clearSearch()}
            className="ms-3"
            $variant="system"
          >
            <>Clear search</>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchInput;
