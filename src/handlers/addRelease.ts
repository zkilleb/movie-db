import { api } from './axios';

export async function addRelease(params: {}) {
  return await api.put('/add/release', undefined, {
    params,
  });
}
