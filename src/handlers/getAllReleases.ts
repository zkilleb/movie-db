import { api } from './axios';

export async function getAllReleases(): Promise<any> {
  return await api.get('/releases').then((res) => {
    return res.data;
  });
}
