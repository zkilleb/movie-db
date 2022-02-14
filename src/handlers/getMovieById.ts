import { api } from './axios';

export async function getMovieById(id: string): Promise<any> {
  return await api.get(`/title/id/${id}`).then((res) => {
    return res.data;
  });
}
