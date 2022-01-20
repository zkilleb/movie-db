import axios from 'axios';

export async function getReview(title: string, year: number): Promise<any> {
  return await axios
    .get(`http://localhost:8080/review/${title}/${year}`)
    .then((res) => {
      return res;
    });
}
