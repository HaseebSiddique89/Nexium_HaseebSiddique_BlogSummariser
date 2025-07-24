import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('summaries')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return Response.json({ success: true, count });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
} 