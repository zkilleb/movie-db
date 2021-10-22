import axios from "axios";

export async function getTMDBKeyword(title: string | null): Promise<[]> {
  return await axios
    .get(`http://localhost:8080/keyword-search/${title}`)
    .then((res) => {
      return res.data;
    });
}
