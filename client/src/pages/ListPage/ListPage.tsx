import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAds } from "../../api/ads";
import AdCard from "../../components/AdCard/AdCard";
import Filters from "./Filters";
import SortPanel from "./SortPanel";
import type { AdsQueryParams } from "../../api/ads";

const ListPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdsQueryParams>({});
  const [sort, setSort] = useState<Partial<AdsQueryParams>>({});

  const queryParams: AdsQueryParams = {
    page,
    limit: 10,
    ...filters,
    ...sort,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ads", queryParams],
    queryFn: () => getAds(queryParams),
  });

  if (isLoading) {
    return <div className="page-status">Загрузка…</div>;
  }

  if (isError) {
    return (
      <div className="page-status page-status--error">
        Ошибка загрузки списка объявлений
      </div>
    );
  }

  const ads = data?.ads ?? [];
  const pagination = data?.pagination;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Список объявлений</h1>
          {pagination && (
            <div className="page-subtitle">
              Всего объявлений: {pagination.totalItems}
            </div>
          )}
        </div>
      </div>

      <div className="page-layout page-layout--with-sidebar">
        <aside className="page-sidebar">
          <Filters
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
        </aside>

        <section className="page-content">
          <SortPanel
            onChange={(s) => {
              setSort(s);
              setPage(1);
            }}
          />

          <div className="cards-list">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {pagination && (
            <div className="pagination">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Назад
              </button>

              <span className="pagination-info">
                Страница {pagination.currentPage} из {pagination.totalPages}
              </span>

              <button
                className="btn btn-ghost"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ListPage;
