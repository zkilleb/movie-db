import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.REACT_APP_SERVER_PORT && process.env.REACT_APP_SERVER_HOST
      ? `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`
      : 'http://localhost:8080',
});
