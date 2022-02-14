import { api } from './axios';

export async function searchActor(name: string | null): Promise<[]> {
  return await api.get(`/actor/${name}`).then((res) => {
    return res.data;
  });
}
