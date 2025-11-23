import { api } from "./axios";
import type { StatsSummary, ActivityData, DecisionsData } from "../types/stats";
import type { StatsQueryParams } from "./statsTypes";

export const getSummaryStats = async (params?: StatsQueryParams) => {
  const { data } = await api.get<StatsSummary>("/stats/summary", { params });
  return data;
};

export const getActivityChart = async (params?: StatsQueryParams) => {
  const { data } = await api.get<ActivityData[]>("/stats/chart/activity", { params });
  return data;
};

export const getDecisionsChart = async (params?: StatsQueryParams) => {
  const { data } = await api.get<DecisionsData>("/stats/chart/decisions", { params });
  return data;
};

export const getCategoriesChart = async (params?: StatsQueryParams) => {
  const { data } = await api.get<Record<string, number>>(
    "/stats/chart/categories",
    { params }
  );
  return data;
};
