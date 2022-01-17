import axios from "axios";

export async function getRandom(): Promise<any> {
  return await axios.get(`http://localhost:8080/random-title`).then((res) => {
    return res.data;
  });
}
