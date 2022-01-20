import axios from 'axios';

export async function searchDirector(name: string | null): Promise<[]> {
  return await axios
    .get(`http://localhost:8080/director/${name}`)
    .then((res) => {
      return res.data;
    });
}
