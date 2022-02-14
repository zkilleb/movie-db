import { api } from './axios';

export async function deleteMovie(id: string) {
  return await api.delete(`/title/${id}`).then((res) => {
    return res;
  });
}
