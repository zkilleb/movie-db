import axios from 'axios';

export async function getAllMovies(): Promise<any> {
  return await axios.get('http://localhost:8080/titles').then((res) => {
    return res.data;
  });
}
