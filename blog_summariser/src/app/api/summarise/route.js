export async function POST(req) {
  try {
    let { content } = await req.json();
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      console.error('HuggingFace API token not set.');
      return Response.json({ success: false, error: 'HuggingFace API token not set.' });
    }

    // Trim whitespace and empty lines from start and end
    content = content.replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');

    // Truncate input to 4096 characters (model limit is 1024 tokens, this is a safe approximation)
    const truncatedContent = content.slice(0, 4096);

    // Calculate summary length: 30-40% of original text length (in characters), but cap to model limits
    const originalLength = truncatedContent.length;
    let min_length = Math.max(30, Math.floor(originalLength * 0.3));
    let max_length = Math.floor(originalLength * 0.4);
    // Cap to model's max output tokens
    if (max_length > 142) max_length = 142;
    if (min_length > 130) min_length = 130;
    if (min_length >= max_length) min_length = max_length - 10;
    if (min_length < 30) min_length = 30;

    const payload = {
      inputs: truncatedContent,
      parameters: { max_length, min_length, do_sample: false },
    };
    console.log('Sending to HuggingFace:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    const rawResult = await response.clone().text();
    console.log('HuggingFace raw response:', rawResult);

    let summary = '';
    let errorMsg = '';
    try {
      const result = JSON.parse(rawResult);
      if (Array.isArray(result) && result[0]?.summary_text) {
        summary = result[0].summary_text;
      } else if (result.error) {
        errorMsg = result.error;
      }
    } catch (e) {
      errorMsg = 'Failed to parse HuggingFace response.';
    }
    // Trim whitespace and empty lines from summary
    summary = summary.replace(/^[\s\r\n]+|[\s\r\n]+$/g, '');
    console.log('Extracted summary:', summary);

    if (!summary) {
      console.error('Summarization error:', errorMsg || 'No summary returned.');
      return Response.json({ success: false, error: errorMsg || 'Summarization failed. Try with a shorter or different input.' });
    }

    return Response.json({ success: true, summary });
  } catch (error) {
    console.error('Summarization API error:', error);
    return Response.json({ success: false, error: error.message });
  }
}
