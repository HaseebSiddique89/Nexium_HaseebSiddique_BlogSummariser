import { supabase } from '../../../../lib/supabase';

export async function POST(req) {
  try {
    const { url, summary } = await req.json();

    const { data, error } = await supabase.from('summaries').insert([
      { url, summary }
    ]);

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
