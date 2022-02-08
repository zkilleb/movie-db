import axios from 'axios';

export async function addRelease(params: {}) {
  return await axios.put('http://localhost:8080/add/release', undefined, {
    params,
  });
}
