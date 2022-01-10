import axios from "axios";

export async function editMovie(params: {}) {
  return await axios.put("http://localhost:8080/edit/title", undefined, {
    params,
  });
}
