import axios from 'axios';

export async function searchActor(name: string | null): Promise<[]> {
  return await axios.get(`http://localhost:8080/actor/${name}`).then((res) => {
    return res.data;
  });
}
