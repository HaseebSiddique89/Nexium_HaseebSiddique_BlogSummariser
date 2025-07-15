// app/api/scrape/route.js

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const { url } = await req.json();

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let blogText = '';
    $('p').each((_, el) => {
      blogText += $(el).text() + '\n';
    });

    return Response.json({ success: true, content: blogText });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
