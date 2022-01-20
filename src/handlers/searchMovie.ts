import axios from 'axios';
import { Result } from '../classes';

export async function searchMovie(title: string | null): Promise<Result[]> {
  return await axios
    .get(`http://localhost:8080/titles/${title}`)
    .then((res) => {
      return res.data;
    });
}
