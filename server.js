require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { parse } = require('csv-parse/sync');
const Anthropic = require('@anthropic-ai/sdk');

// Assumption: Haiku model ID; change here if your account uses a different one.
const MODEL = 'claude-haiku-5-5';
const SYSTEM = fs.readFileSync('prompts/summarize_notes.md', 'utf8');

// Rows stay exactly as stored; ISO DateTime strings sort chronologically.
const rows = parse(fs.readFileSync('docs/dummy_notes_200.csv', 'utf8'), { columns: true, skip_empty_lines: true });
const people = [];
for (const r of rows) {
  let p = people.find((x) => x.id === r.ID);
  if (!p) people.push((p = { id: r.ID, name: r.Name, notes: [] }));
  p.notes.push({ datetime: r.DateTime, note: r.Note });
}
people.forEach((p) => p.notes.sort((a, b) => a.datetime.localeCompare(b.datetime)));

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('src/images')); // logo lives in src/images

app.get('/api/people', (_req, res) => res.json(people));

// Only called when the user clicks "Summarize notes".
app.post('/api/summarize', async (req, res) => {
  const p = people.find((x) => x.id === req.body.id);
  if (!p) return res.status(404).json({ error: 'Person not found' });
  try {
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4000, // headroom: the model may spend tokens on a thinking block before the text
      system: SYSTEM,
      messages: [{ role: 'user', content: p.notes.map((n) => `${n.datetime} ${n.note}`).join('\n') }],
    });
    const text = msg.content.find((b) => b.type === 'text')?.text;
    if (!text) throw new Error('no text in response, stop_reason=' + msg.stop_reason);
    res.json({ summary: text });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Could not make a summary. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('http://localhost:' + PORT));
