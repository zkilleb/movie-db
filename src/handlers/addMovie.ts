import { api } from './axios';

export async function addMovie(params: {}) {
  return await api.post('/add/title', undefined, {
    params,
  });
}
