import { api } from './axios';

export async function deleteRelease(params: {}) {
  return await api.put('/delete/release', undefined, {
    params,
  });
}
