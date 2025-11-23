import { useState } from "react";
import type { AdsQueryParams } from "../../api/ads";
import type { AdStatus, Priority } from "../../types/ad";
import CategorySelect from "../../components/CategorySelect/CategorySelect";

const CATEGORY_MAP: Record<string, number> = {
  "Электроника": 0,
  "Недвижимость": 1,
  "Транспорт": 2,
  "Работа": 3,
  "Услуги": 4,
  "Животные": 5,
  "Мода": 6,
  "Детское": 7,
};

const statuses = [
  { label: "Любой", value: undefined },
  { label: "На модерации", value: "pending" },
  { label: "Одобрено", value: "approved" },
  { label: "Отклонено", value: "rejected" },
  { label: "Черновик", value: "draft" },
];

const priorities = [
  { label: "Любой", value: undefined },
  { label: "Срочное", value: "urgent" },
  { label: "Не срочное", value: "normal" },
];

interface Props {
  onChange: (filters: AdsQueryParams) => void;
}

const Filters = ({ onChange }: Props) => {
  const [status, setStatus] = useState<AdStatus | undefined>(undefined);
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");

  const applyFilters = () => {
    onChange({
      status,
      priority,
      categoryId: category ? CATEGORY_MAP[category] : undefined,
      minPrice,
      maxPrice,
      search: search || undefined,
    });
  };

  const reset = () => {
    setStatus(undefined);
    setPriority(undefined);
    setCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearch("");
    onChange({});
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Фильтры</div>
      </div>
      <div className="panel-body">
        <div className="form-field">
          <div className="form-label">Статус:</div>
          <div className="chips">
            {statuses.map((s) => (
              <label key={s.label} className="filter-status-item">
                <input
                  type="radio"
                  name="status"
                  checked={status === s.value}
                  onChange={() => setStatus(s.value as AdStatus | undefined)}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-field">
          <div className="form-label">Срочность:</div>
          <div className="chips">
            {priorities.map((p) => (
              <label key={p.label} className="filter-status-item">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === p.value}
                  onChange={() => setPriority(p.value as Priority | undefined)}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-field">
          <div className="form-label">Категория:</div>
          <CategorySelect value={category} onChange={setCategory} />
        </div>

        <div className="form-field">
          <div className="form-label">Цена:</div>
          <div className="form-row">
            <input
              className="input input-sm"
              type="number"
              placeholder="От"
              value={minPrice ?? ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <span className="form-separator">—</span>
            <input
              className="input input-sm"
              type="number"
              placeholder="До"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>

        <div className="form-field">
          <div className="form-label">Поиск:</div>
          <input
            className="input"
            type="text"
            placeholder="Название или описание..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-actions">
          <button className="btn btn-primary" onClick={applyFilters}>
            Применить
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
