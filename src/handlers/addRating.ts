import { api } from './axios';

export async function addRating(params: {}) {
  return await api.put('/add/rating', undefined, {
    params,
  });
}
