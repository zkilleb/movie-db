import axios from "axios";

export async function getTMDBKeyword(
  title: string | null,
  type: string | null
): Promise<[]> {
  let route = "";
  if (type === "title") route = `keyword-search/${title}`;
  if (type === "director") route = `person-search/${title}`;
  return await axios.get(`http://localhost:8080/${route}`).then((res) => {
    return res.data;
  });
}
