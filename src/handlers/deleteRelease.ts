import axios from 'axios';

export async function deleteRelease(params: {}) {
  return await axios.put('http://localhost:8080/delete/release', undefined, {
    params,
  });
}
