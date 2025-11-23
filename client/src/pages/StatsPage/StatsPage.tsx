import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getSummaryStats,
  getActivityChart,
  getDecisionsChart,
  getCategoriesChart,
} from "../../api/stats";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type {
  StatsSummary,
  ActivityData,
  DecisionsData,
} from "../../types/stats";

import "./StatsPage.css";

type Period = "today" | "week" | "month";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Сегодня", value: "today" },
  { label: "7 дней", value: "week" },
  { label: "30 дней", value: "month" },
];

const PIE_COLORS = [
  "var(--avito-green)",
  "var(--avito-red)",
  "var(--avito-purple)",
];


const exportCSV = (
  summary: StatsSummary,
  chosenTotal: number,
  categories: Record<string, number>,
  period: string
) => {
  let csv = "Метрика,Значение\n";

  csv += `Всего проверено (${period}),${chosenTotal}\n`;

  csv += `Одобрено %,${summary.approvedPercentage.toFixed(1)}\n`;
  csv += `Отклонено %,${summary.rejectedPercentage.toFixed(1)}\n`;
  csv += `На доработку %,${summary.requestChangesPercentage.toFixed(1)}\n`;
  csv += `Среднее время проверки (сек),${summary.averageReviewTime}\n\n`;

  csv += "Категория,Количество\n";
  Object.entries(categories).forEach(([name, value]) => {
    csv += `${name},${value}\n`;
  });

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moderation_stats.csv";
  a.click();
};


const StatsPage = () => {
  const [period, setPeriod] = useState<Period>("today");

  const summaryQuery = useQuery<StatsSummary>({
    queryKey: ["stats-summary"],
    queryFn: () => getSummaryStats({}),
  });

  const activityQuery = useQuery<ActivityData[]>({
    queryKey: ["stats-activity"],
    queryFn: () => getActivityChart({ period: "week" }),
  });

  const decisionsQuery = useQuery<DecisionsData>({
    queryKey: ["stats-decisions"],
    queryFn: () => getDecisionsChart({}),
  });

  const categoriesQuery = useQuery<Record<string, number>>({
    queryKey: ["stats-categories"],
    queryFn: () => getCategoriesChart({}),
  });

  const isLoading =
    summaryQuery.isLoading ||
    activityQuery.isLoading ||
    decisionsQuery.isLoading ||
    categoriesQuery.isLoading;

  if (isLoading) return <div className="page-status">Загрузка…</div>;

  if (summaryQuery.isError)
    return (
      <div className="page-status page-status--error">
        Ошибка загрузки статистики
      </div>
    );

  const summary = summaryQuery.data!;
  const decisions = decisionsQuery.data;
  const categories = categoriesQuery.data || {};
  const activity = activityQuery.data || [];

  const chosenTotal =
    period === "today"
      ? summary.totalReviewedToday
      : period === "week"
      ? summary.totalReviewedThisWeek
      : summary.totalReviewedThisMonth;

  const decisionsData = decisions
    ? [
        { name: "Одобрено", value: decisions.approved },
        { name: "Отклонено", value: decisions.rejected },
        { name: "На доработку", value: decisions.requestChanges },
      ]
    : [];

  const categoriesData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="page">
      <div className="stats-header">
        <h1 className="page-title">Статистика модерации</h1>

        <div className="period-switch">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`period-btn ${period === p.value ? "active" : ""}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="export-block">
          <button
            className="btn btn-primary"
            onClick={() =>
              exportCSV(summary, chosenTotal, categories, period)
            }
          >
            Экспорт CSV
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <StatCard title="Всего проверено" value={chosenTotal} />
        <StatCard
          title="Одобрено"
          value={summary.approvedPercentage.toFixed(1) + "%"}
        />
        <StatCard
          title="Отклонено"
          value={summary.rejectedPercentage.toFixed(1) + "%"}
        />
        <StatCard
          title="На доработку"
          value={summary.requestChangesPercentage.toFixed(1) + "%"}
        />
      </div>

      <div className="charts-row">
        <div className="panel chart-panel">
          <h3>Активность за 7 дней</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="var(--avito-green)" name="Одобрено" />
                <Bar dataKey="rejected" fill="var(--avito-red)" name="Отклонено" />
                <Bar
                  dataKey="requestChanges"
                  fill="var(--avito-purple)"
                  name="На доработку"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-panel">
          <h3>Распределение решений</h3>
          <div className="chart-container-small">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={decisionsData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {decisionsData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="avg-time">
            Среднее время проверки:{" "}
            <strong>{summary.averageReviewTime} сек.</strong>
          </div>
        </div>
      </div>

      <div className="panel chart-panel">
        <h3>Категории</h3>

        {categoriesData.length === 0 ? (
          <div className="empty-state">Нет данных за выбранный период</div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--avito-blue)"
                  name="Проверено"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="panel stat-card">
    <div className="stat-title">{title}</div>
    <div className="stat-value">{value}</div>
  </div>
);

export default StatsPage;
