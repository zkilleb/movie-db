import axios from 'axios';

export async function getMovieById(id: string): Promise<any> {
  return await axios.get(`http://localhost:8080/title/id/${id}`).then((res) => {
    return res.data;
  });
}
