const urduDictionary = {
  "technology": "ٹیکنالوجی",
  "science": "سائنس",
  "development": "ترقی",
  "education": "تعلیم",
  "health": "صحت",
  "blog": "بلاگ",
  "summary": "خلاصہ",
  "internet": "انٹرنیٹ",
  "data": "ڈیٹا",
  "computer": "کمپیوٹر",
};

export async function POST(req) {
  try {
    const { text } = await req.json();

    let translated = text;

    // Replace known words using the dictionary
    for (const [english, urdu] of Object.entries(urduDictionary)) {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translated = translated.replace(regex, urdu);
    }

    return Response.json({ success: true, translated });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
