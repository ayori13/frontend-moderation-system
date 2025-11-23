import type { AdsQueryParams } from "../../api/ads";

interface Props {
  onChange: (sort: Partial<AdsQueryParams>) => void;
}

const SortPanel = ({ onChange }: Props) => {
  const apply = (sort: Partial<AdsQueryParams>) => onChange(sort);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Сортировка</h2>
      </div>

      <div className="panel-body sort-panel">
        <div className="button-group">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "createdAt", sortOrder: "desc" })}
          >
            Сначала новые
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "createdAt", sortOrder: "asc" })}
          >
            Сначала старые
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "price", sortOrder: "asc" })}
          >
            Цена ↑
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "price", sortOrder: "desc" })}
          >
            Цена ↓
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "priority", sortOrder: "desc" })}
          >
            Срочные вверх
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => apply({ sortBy: "priority", sortOrder: "asc" })}
          >
            Срочные вниз
          </button>
          <button
            className="btn btn-ghost btn-sm button-group-right"
            onClick={() => apply({})}
          >
            Без сортировки
          </button>
        </div>
      </div>
    </section>
  );
};

export default SortPanel;
