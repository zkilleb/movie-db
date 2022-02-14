import { api } from './axios';

export async function getTMDBKeyword(
  title: string | null,
  type: string | null,
): Promise<[]> {
  let route = '';
  if (type === 'title') route = `keyword-search/${title}`;
  if (type === 'director' || type === 'actor')
    route = `person-search/${title}/${type}`;
  return await api.get(`/${route}`).then((res) => {
    return res.data;
  });
}
