
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || 'ollama', 
  basePath: process.env.OPENAI_API_BASE || 'http://localhost:11434/v1', 
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const { task } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'llama3:8b', 
      messages: [
        { role: 'system', content: 'You are a personal assistant for task management.' },
        { role: 'user', content: `Here is a new task: ${task}` },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
}
