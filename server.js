import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
// Serve static assets from root folder
app.use(express.static(__dirname));

// Translation API endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, mode = 'auto' } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: '请提供有效的翻译文本' });
    }

    const trimmedText = text.trim();
    // Detect language simple heuristic
    const isChineseInput = /[\u4e00-\u9fa5]/.test(trimmedText);
    let targetLangName = '中文';
    let targetLangCode = 'zh';
    let sourceLangCode = 'en';

    if (mode === 'zh2en' || (mode === 'auto' && isChineseInput)) {
      targetLangName = '英文 (English)';
      targetLangCode = 'en';
      sourceLangCode = 'zh';
    } else {
      targetLangName = '中文';
      targetLangCode = 'zh';
      sourceLangCode = 'en';
    }

    // Try Gemini API if GEMINI_API_KEY is present
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a professional translator and language learning assistant.
Translate the following text into ${targetLangName}.
Translate accurately, maintaining appropriate tone and context.

Source Text:
"""
${trimmedText}
"""

Return ONLY a valid JSON object matching this structure:
{
  "sourceLang": "${sourceLangCode}",
  "targetLang": "${targetLangCode}",
  "translatedText": "Accurate, fluent translation",
  "phonetic": "Phonetic / IPA or Pinyin if single word or short phrase, else empty string",
  "keywords": [
    {"word": "key word or phrase in source", "meaning": "translation or explanation"}
  ],
  "notes": "Brief contextual or usage note if helpful, else empty string"
}`;

      // List of candidate models to try in order when 503/429/high demand occurs
      const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

      for (const modelName of candidateModels) {
        try {
          const aiResponse = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          if (aiResponse && aiResponse.text) {
            const parsed = JSON.parse(aiResponse.text.trim());
            return res.json({
              success: true,
              provider: 'Gemini AI',
              ...parsed
            });
          }
        } catch (geminiErr) {
          console.warn(`Gemini API call warning with ${modelName}, attempting fallback:`, geminiErr.message);
        }
      }
    }

    // Fallback translation using MyMemory / Free API or local heuristic
    try {
      const pair = sourceLangCode === 'zh' ? 'zh-CN|en' : 'en|zh-CN';
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedText)}&langpair=${pair}`;
      const apiRes = await fetch(myMemoryUrl);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.responseData && data.responseData.translatedText) {
          let transText = data.responseData.translatedText;

          // Simple keyword extraction for cards
          const words = trimmedText.split(/\s+/).filter(w => w.length > 2).slice(0, 3);
          const keywords = words.map(w => ({ word: w, meaning: '核心词汇' }));

          return res.json({
            success: true,
            provider: 'Free Translation Engine',
            sourceLang: sourceLangCode,
            targetLang: targetLangCode,
            translatedText: transText,
            phonetic: '',
            keywords: keywords,
            notes: '普通快速翻译模式'
          });
        }
      }
    } catch (fallbackErr) {
      console.warn('Free API fallback error:', fallbackErr.message);
    }

    // Ultimate fallback if offline/unreachable
    return res.json({
      success: true,
      provider: 'Basic Engine',
      sourceLang: sourceLangCode,
      targetLang: targetLangCode,
      translatedText: sourceLangCode === 'zh' ? `[Translation] ${trimmedText}` : `[译文] ${trimmedText}`,
      phonetic: '',
      keywords: [],
      notes: '请连接网络体验 AI 高精翻译'
    });

  } catch (err) {
    console.error('Translation route error:', err);
    res.status(500).json({ error: '翻译请求处理异常：' + err.message });
  }
});

// Fallback route for SPA / direct link navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

