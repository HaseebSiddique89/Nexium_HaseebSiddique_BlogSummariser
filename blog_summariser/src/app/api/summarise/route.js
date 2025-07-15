export async function POST(req) {
  try {
    const { content } = await req.json();

    // Basic static summarization: Get first 3 sentences
    const sentences = content.split('.').filter(Boolean);
    const summary = sentences.slice(0, 3).join('. ') + '.';

    return Response.json({ success: true, summary });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
