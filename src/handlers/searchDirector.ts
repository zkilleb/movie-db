import { api } from './axios';

export async function searchDirector(name: string | null): Promise<[]> {
  return await api.get(`/director/${name}`).then((res) => {
    return res.data;
  });
}
