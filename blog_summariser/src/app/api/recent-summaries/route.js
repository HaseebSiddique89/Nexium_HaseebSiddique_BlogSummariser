import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('id, url, summary, created_at, reads')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw error;
    return Response.json({ success: true, summaries: data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
} 