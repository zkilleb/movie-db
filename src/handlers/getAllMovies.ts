import { api } from './axios';

export async function getAllMovies(): Promise<any> {
  return await api.get('/titles').then((res) => {
    return res.data;
  });
}
