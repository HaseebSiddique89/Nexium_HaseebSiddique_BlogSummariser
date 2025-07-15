import { saveFullText } from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const { url, content } = await req.json();

    const result = await saveFullText(url, content);

    return Response.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
