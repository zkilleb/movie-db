import { api } from './axios';

export async function addBulkMovie(data: string) {
  return await api.post('/add/title/bulk', { data }).then((res) => {
    return res.data;
  });
}
