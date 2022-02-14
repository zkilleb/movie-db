import { api } from './axios';

export async function getRandom(): Promise<any> {
  return await api.get(`/random-title`).then((res) => {
    return res.data;
  });
}
