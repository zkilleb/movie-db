import { api } from './axios';

export async function editMovie(params: {}) {
  return await api.put('/edit/title', undefined, {
    params,
  });
}
