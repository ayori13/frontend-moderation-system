import { useState, useEffect, useRef } from "react";
import "./CategorySelect.css";

const CATEGORIES = [
  "Электроника",
  "Недвижимость",
  "Транспорт",
  "Работа",
  "Услуги",
  "Животные",
  "Мода",
  "Детское",
];

interface Props {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const CategorySelect = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = CATEGORIES.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selectCategory = (c: string) => {
    onChange(c);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="category-select">
      <button
        className="input category-select-btn"
        onClick={() => setOpen(!open)}
      >
        {value ?? "Выбрать категорию"}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="dropdown">
          <input
            className="input input-sm search-input"
            placeholder="Поиск категории..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="dropdown-list">
            {filtered.length === 0 && (
              <div className="dropdown-empty">Не найдено</div>
            )}

            {filtered.map(c => (
              <div
                key={c}
                className="dropdown-item"
                onClick={() => selectCategory(c)}
              >
                {c}
              </div>
            ))}

            <div
              className="dropdown-item clear-btn"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Сбросить
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
