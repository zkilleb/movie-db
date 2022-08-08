import { api } from './axios';

export async function getReview(
  title: string,
  year: number,
  id: string,
): Promise<any> {
  return await api.get(`/review/${title}/${year}/${id}`).then((res) => {
    return res;
  });
}
