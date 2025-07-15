'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [url, setUrl] = useState('');
  const [blogText, setBlogText] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');

  const handleSubmit = async () => {
    if (!url) return;

    // 1. Scrape blog content
    const scrapeRes = await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    const scraped = await scrapeRes.json();
    setBlogText(scraped.content || '');

    // 2. Simulate AI summary
    const summaryRes = await fetch('/api/summarise', {
      method: 'POST',
      body: JSON.stringify({ content: scraped.content }),
    });
    const summaryData = await summaryRes.json();
    setSummary(summaryData.summary);

    // 3. Translate to Urdu
    const urduRes = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: summaryData.summary }),
    });
    const urduData = await urduRes.json();
    setUrduSummary(urduData.translation);

    // 4. Save summary in Supabase
    await fetch('/api/save-summary', {
      method: 'POST',
      body: JSON.stringify({ url, summary: summaryData.summary }),
    });

    // 5. Save full text in MongoDB
    await fetch('/api/save-fulltext', {
      method: 'POST',
      body: JSON.stringify({ url, content: scraped.content }),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSubmit}>Summarise Blog</Button>
        </CardContent>
      </Card>

      {blogText && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Blog Text</h2>
            <Textarea value={blogText} readOnly className="h-40" />
          </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold">AI Summary (English)</h2>
            <Textarea value={summary} readOnly className="h-32" />
          </CardContent>
        </Card>
      )}

      {urduSummary && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Urdu Translation</h2>
            <Textarea value={urduSummary} readOnly className="h-32" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
