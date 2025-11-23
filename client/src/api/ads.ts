import { api } from "../api/axios";

import type { Advertisement, Pagination, AdStatus } from "../types/ad";

export interface AdsListResponse {
  ads: Advertisement[];
  pagination: Pagination;
}

export interface AdsQueryParams {
  page?: number;
  limit?: number;
  status?: AdStatus[]; 
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "createdAt" | "price" | "priority";
  sortOrder?: "asc" | "desc";
}

export const getAds = async (params: AdsQueryParams) => {
  const { data } = await api.get<AdsListResponse>("/ads", { params });
  return data;
};

export const getAdById = async (id: number) => {
  const { data } = await api.get<Advertisement>(`/ads/${id}`);
  return data;
};

export const approveAd = async (id: number) => {
  const { data } = await api.post(`/ads/${id}/approve`);
  return data;
};

export const rejectAd = async (id: number, reason: string, comment?: string) => {
  const { data } = await api.post(`/ads/${id}/reject`, { reason, comment });
  return data;
};

export const requestChanges = async (
  id: number,
  reason: string,
  comment?: string
) => {
  const { data } = await api.post(`/ads/${id}/request-changes`, {
    reason,
    comment,
  });
  return data;
};
