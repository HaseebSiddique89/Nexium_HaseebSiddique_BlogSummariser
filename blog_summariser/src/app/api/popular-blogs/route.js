import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    // Try to select with reads field
    let { data, error } = await supabase
      .from('summaries')
      .select('title, url, category, reads, created_at')
      .order('reads', { ascending: false })
      .limit(5);
    // If reads field doesn't exist or all are null, fallback to created_at
    if (error || !data || data.every(item => item.reads == null)) {
      ({ data, error } = await supabase
        .from('summaries')
        .select('title, url, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5));
    }
    if (error) throw error;
    return Response.json({ success: true, blogs: data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
} 