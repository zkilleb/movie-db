import { MongoClient } from 'mongodb';
import { uri } from './constants.js';

export function connectToDB() {
  const client = new MongoClient(uri);

  client.connect().catch(() => {
    console.error('ERROR: Problem connecting to database');
    client.close();
  });

  const database = client.db(process.env.DB_NAME || 'mydb');
  const movies = database.collection(process.env.COLLECTION || 'movies');
  return movies;
}
