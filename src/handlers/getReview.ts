import { api } from './axios';

export async function getReview(title: string, year: number): Promise<any> {
  return await api.get(`/review/${title}/${year}`).then((res) => {
    return res;
  });
}
