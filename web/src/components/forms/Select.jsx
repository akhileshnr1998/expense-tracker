import { useEffect, useMemo, useRef, useState } from 'react';

export default function Select({ label, options, value, onChange, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    function handleClick(event) {
      if (!menuRef.current || !buttonRef.current) return;
      if (
        menuRef.current.contains(event.target) ||
        buttonRef.current.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  function toggle() {
    setOpen((prev) => !prev);
  }

  function handleSelect(optionValue) {
    onChange(optionValue);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <label className="select-field">
      {label}
      <button
        className="select-trigger"
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        ref={buttonRef}
      >
        <span className="select-value">
          {selected ? (
            <span className="select-item">
              {selected.color ? (
                <span className="category-dot" style={{ backgroundColor: selected.color }} />
              ) : null}
              {selected.label}
            </span>
          ) : (
            <span className="select-placeholder">{placeholder}</span>
          )}
        </span>
        <span className="select-arrow" aria-hidden="true" />
      </button>
      <div
        className={`select-menu ${open ? 'open' : ''}`}
        role="listbox"
        ref={menuRef}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className={`select-option ${option.value === value ? 'selected' : ''}`}
            type="button"
            role="option"
            aria-selected={option.value === value}
            onClick={() => handleSelect(option.value)}
          >
            {option.color ? (
              <span className="category-dot" style={{ backgroundColor: option.color }} />
            ) : null}
            {option.label}
          </button>
        ))}
      </div>
    </label>
  );
}
