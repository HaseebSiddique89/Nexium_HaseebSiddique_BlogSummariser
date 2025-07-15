import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'nexium-mongo';

export async function saveFullText(url, content) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('blogs');

  const result = await collection.insertOne({ url, content, created_at: new Date() });

  return result;
}
