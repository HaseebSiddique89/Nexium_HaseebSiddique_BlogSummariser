import { supabase } from '../../../../lib/supabase';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'nexium-mongo';

export async function GET() {
  try {
    // Get total summaries from Supabase
    const { count: totalSummaries, error: summariesError } = await supabase
      .from('summaries')
      .select('*', { count: 'exact', head: true });
    if (summariesError) throw summariesError;

    // Get total blogs from MongoDB
    await client.connect();
    const db = client.db(dbName);
    const blogsCollection = db.collection('blogs');
    const totalBlogs = await blogsCollection.countDocuments();

    // Placeholder for users and uptime
    const totalUsers = 0; // TODO: Implement if you have user auth
    const uptime = '99.9%'; // Static for now

    return Response.json({
      success: true,
      stats: {
        totalSummaries,
        totalBlogs,
        totalUsers,
        uptime
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
} 