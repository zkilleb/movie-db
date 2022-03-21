import { api } from './axios';

export async function deleteReleaseFromAll(movieId: string, releaseId: string) {
  return await api
    .put(`/delete/release/${movieId}/${releaseId}`)
    .then((res) => {
      console.log(res);
      return res;
    });
}
