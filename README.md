# Blog Summarizer & Translator

A full-stack AI-powered web application that:
- Scrapes blog content from a given URL
- Generates a concise summary using state-of-the-art NLP models (HuggingFace Transformers)
- Translates the summary into Urdu (or other languages) using Google Gemini
- Saves and displays recent summaries and analytics

---

## Features

- **AI Summarization:** Uses HuggingFace’s `facebook/bart-large-cnn` model to generate summaries that are 30–40% the length of the original text.
- **Dynamic Translation:** Translates summaries into Urdu (or other languages) using Google Gemini API.
- **Clean Output:** All whitespace and empty lines are trimmed from scraped text, summaries, and translations.
- **Recent Summaries & Analytics:** View recent activity and usage statistics.
- **Modern UI:** Built with Next.js, React, and a beautiful, responsive design.

---

## Tech Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **AI/NLP:** HuggingFace Inference API (`facebook/bart-large-cnn`), Google Gemini API
- **Database:** (If used) MongoDB or Supabase (see `/lib`)
- **Other:** Environment variables for API keys

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blog_summariser.git
cd blog_summariser
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# HuggingFace Inference API Token (get from https://huggingface.co/settings/tokens)
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini API Key (get from Google AI Studio or Google Cloud Console)
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) MongoDB/Supabase credentials if using database features
```

### 4. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Paste a blog URL** into the input field and click "Generate Summary".
2. The app will:
   - Scrape the blog content
   - Summarize it using HuggingFace
   - Translate the summary to Urdu (or your selected language)
   - Save and display the results
3. View recent summaries and analytics from the dashboard.

---

## API & Internal Logic

### Summarization (`/api/summarise`)

- Receives blog content.
- Trims whitespace and empty lines.
- Truncates to 4096 characters (model limit).
- Calculates summary length as 30–40% of the input (capped to model’s max: 142 tokens).
- Calls HuggingFace Inference API (`facebook/bart-large-cnn`).
- Returns a clean, concise summary.

### Translation (`/api/translate`)

- Receives summary text and target language.
- Trims whitespace and empty lines.
- If text is empty, returns an error.
- Calls Google Gemini API to translate the summary.
- Returns the translated summary, trimmed of whitespace.

### Error Handling

- If summarization or translation fails, the error is shown in the UI and not passed to the next step.
- All API keys are required and must be set in `.env.local`.

---

## Customization

- **Change Target Language:** Add more languages in the frontend dropdown; the backend will dynamically translate to any language supported by Gemini.
- **Adjust Summary Length:** Modify the percentage in `/api/summarise/route.js` if you want shorter or longer summaries.
- **Styling:** Customize UI components in `/src/components/ui/` and global styles in `/src/app/globals.css`.

---

## Obtaining API Keys

### HuggingFace

1. Sign up at [huggingface.co](https://huggingface.co/join).
2. Go to [Access Tokens](https://huggingface.co/settings/tokens).
3. Create a new token (role: Read).
4. Add it to `.env.local` as `HF_TOKEN`.

### Google Gemini

1. Sign up at [Google AI Studio](https://aistudio.google.com/) or [Google Cloud Console](https://console.cloud.google.com/ai/gemini/models).
2. Create an API key for Gemini.
3. Add it to `.env.local` as `GEMINI_API_KEY`.

---

## Project Structure
![Project Structure](https://github.com/HaseebSiddique89/Nexium_HaseebSiddique_BlogSummariser/blob/main/blog_summariser/project_structure/structure.PNG)


---

## Troubleshooting

- **No summary or translation appears:**  
  - Check your API keys in `.env.local`.
  - Check the backend logs for errors (see terminal output).
  - Make sure your input text is not too long or too short.

- **HuggingFace “index out of range” error:**  
  - The input is too long or summary length is set too high. The app now automatically caps these values.

- **Translation error:**  
  - The summary may be empty or the Gemini API key is missing/invalid.

---

## Credits

- [HuggingFace Transformers](https://huggingface.co/)
- [Google Gemini](https://ai.google.dev/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

### check live App here https://blogsummariser-nine.vercel.app/


**Feel free to open issues or contribute!**

