import dotenv from 'dotenv';

dotenv.config();

export const host = process.env.REACT_APP_SERVER_HOST || 'http://localhost';
export const port = process.env.REACT_APP_SERVER_PORT || 8080;
export const BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = process.env.API_KEY;
export const uri = process.env.DB_HOST;
export const verbose = process.env.VERBOSE === 'true';
