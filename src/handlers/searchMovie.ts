import axios from "axios";
import { ISearch } from "../classes";

export async function searchMovie(title: string | null): Promise<ISearch[]> {
  return await axios
    .get(`http://localhost:8080/titles/${title}`)
    .then((res) => {
      return res.data;
    });
}
