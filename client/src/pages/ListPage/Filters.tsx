import { useState } from "react";
import type { AdsQueryParams } from "../../api/ads";
import type { AdStatus } from "../../types/ad";

interface Props {
  onChange: (filters: AdsQueryParams) => void;
}

const ALL_STATUSES: AdStatus[] = ["pending", "approved", "rejected", "draft"];

const Filters = ({ onChange }: Props) => {
  const [statuses, setStatuses] = useState<AdStatus[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [search, setSearch] = useState("");

  const toggleStatus = (status: AdStatus) => {
    setStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const applyFilters = () => {
    const f: AdsQueryParams = {};

    if (statuses.length > 0) f.status = statuses;
    if (categoryId !== undefined) f.categoryId = categoryId;
    if (minPrice !== undefined) f.minPrice = minPrice;
    if (maxPrice !== undefined) f.maxPrice = maxPrice;
    if (search.trim() !== "") f.search = search;

    onChange(f);
  };

  const reset = () => {
    setStatuses([]);
    setCategoryId(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearch("");
    onChange({});
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Фильтры</h3>

      {/* Статус */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "4px" }}>Статус:</div>

        {ALL_STATUSES.map((s) => (
          <label key={s} style={{ marginRight: "12px" }}>
            <input
              type="checkbox"
              checked={statuses.includes(s)}
              onChange={() => toggleStatus(s)}
            />
            {" " + s}
          </label>
        ))}
      </div>

      {/* Категория */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "4px" }}>Категория (ID):</div>
        <input
          type="number"
          placeholder="Например 1"
          value={categoryId ?? ""}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      {/* Цена */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "4px" }}>Цена:</div>

        <input
          type="number"
          placeholder="Мин"
          style={{ width: "80px", marginRight: "8px" }}
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : undefined)
          }
        />

        <input
          type="number"
          placeholder="Макс"
          style={{ width: "80px" }}
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      {/* Поиск */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ marginBottom: "4px" }}>Поиск:</div>
        <input
          type="text"
          placeholder="Название или описание..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "200px" }}
        />
      </div>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={applyFilters}>Применить</button>
        <button onClick={reset}>Сбросить</button>
      </div>
    </div>
  );
};

export default Filters;
