import type { AdsQueryParams } from "../../api/ads";

interface Props {
  onChange: (sort: Partial<AdsQueryParams>) => void;
}

const SortPanel = ({ onChange }: Props) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ marginBottom: "12px" }}>Сортировка</h3>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() =>
            onChange({ sortBy: "createdAt", sortOrder: "desc" })
          }
        >
          Новые сначала
        </button>

        <button
          onClick={() =>
            onChange({ sortBy: "createdAt", sortOrder: "asc" })
          }
        >
          Старые сначала
        </button>

        <button
          onClick={() => onChange({ sortBy: "price", sortOrder: "asc" })}
        >
          Цена ↑
        </button>

        <button
          onClick={() => onChange({ sortBy: "price", sortOrder: "desc" })}
        >
          Цена ↓
        </button>

        <button
          onClick={() => onChange({ sortBy: "priority", sortOrder: "desc" })}
        >
          Срочные вверх
        </button>

        <button
          onClick={() => onChange({ sortBy: "priority", sortOrder: "asc" })}
        >
          Срочные вниз
        </button>

        {/* Кнопка сброса сортировки */}
        <button
          style={{ marginLeft: "20px" }}
          onClick={() => onChange({})}
        >
          Без сортировки
        </button>
      </div>
    </div>
  );
};

export default SortPanel;
