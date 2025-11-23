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
  const [sort, setSort] = useState<AdsQueryParams>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ads", page, filters, sort],
    queryFn: () =>
      getAds({
        page,
        limit: 10,
        ...filters,
        ...sort,
      }),
  });

  if (isLoading) return <div style={{ padding: "20px" }}>Загрузка...</div>;
  if (isError) return <div style={{ padding: "20px" }}>Ошибка загрузки</div>;

  const ads = data?.ads || [];
  const pagination = data?.pagination;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Список объявлений</h1>

      <Filters
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      <SortPanel
        onChange={(s) => {
          setSort(s);
          setPage(1);
        }}
      />

      <div style={{ display: "grid", gap: "12px" }}>
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {pagination && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: page <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Назад
          </button>

          <span>
            Страница {pagination.currentPage} из {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              cursor:
                page >= pagination.totalPages ? "not-allowed" : "pointer",
            }}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default ListPage;
