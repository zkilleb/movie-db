import axios from 'axios';

export async function deleteMovie(id: string) {
  return await axios.delete(`http://localhost:8080/title/${id}`).then((res) => {
    return res;
  });
}
