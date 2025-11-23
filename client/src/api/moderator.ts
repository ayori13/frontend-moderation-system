import { api } from "./axios";

export interface Moderator {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export const getCurrentModerator = async () => {
  const { data } = await api.get<Moderator>("/moderators/me");
  return data;
};
