import { supabase } from '../../../../lib/supabase';

export async function POST(req) {
  try {
    const { url, summary, reads } = await req.json();

    const { data, error } = await supabase.from('summaries').insert([
      { url, summary, reads }
    ]);

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}

export async function PATCH(req) {
  try {
    const { id } = await req.json();
    const { data, error } = await supabase
      .from('summaries')
      .update({ reads: supabase.raw('reads + 1') })
      .eq('id', id)
      .select();
    if (error) throw error;
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
