import { useState, useEffect, useRef } from "react";

export function Combobox({ options = [], selected, onChange, placeholder, userIndex }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(selected || "");
  const comboboxRef = useRef(null);
console.log(options);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={comboboxRef}>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto z-50">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  onChange(option);
                  setQuery(option);
                  userIndex(index);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
