import { api } from './axios';
import { Result } from '../classes';

export async function searchMovie(title: string | null): Promise<Result[]> {
  return await api.get(`/titles/${title}`).then((res) => {
    return res.data;
  });
}
