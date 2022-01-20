import axios from 'axios';

export async function addMovie(params: {}) {
  return await axios.post('http://localhost:8080/add/title', undefined, {
    params,
  });
}
