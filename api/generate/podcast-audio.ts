import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Missing script' });
    }

    // For now, return a placeholder
    // In production, integrate with a TTS service like ElevenLabs or Google TTS
    res.json({ 
      audioUrl: null,
      message: 'Audio generation not yet implemented. Use browser TTS for now.'
    });
  } catch (error: any) {
    console.error('Podcast audio generation error:', error);
    res.status(500).json({ error: 'Failed to generate podcast audio', details: error.message });
  }
}
