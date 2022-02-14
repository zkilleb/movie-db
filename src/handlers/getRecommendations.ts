import { api } from './axios';

export async function getRecommendations(id: string): Promise<any> {
  return await api.get(`/recommendations/${id}`).then((res) => {
    return res.data;
  });
}
