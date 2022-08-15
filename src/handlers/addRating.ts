import { api } from './axios';

export async function addRating(params: {}) {
  console.log(params);
  return await api.put('/add/rating', undefined, {
    params,
  });
}
