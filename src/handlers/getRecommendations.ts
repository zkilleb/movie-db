import axios from 'axios';

export async function getRecommendations(id: string): Promise<any> {
  return await axios
    .get(`http://localhost:8080/recommendations/${id}`)
    .then((res) => {
      return res.data;
    });
}
