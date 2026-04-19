import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Puzzle } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askQuestion(puzzle: Puzzle, history: { question: string, answer: string }[], currentQuestion: string): Promise<AsyncIterable<GenerateContentResponse> | string> {
  const prompt = `
    你是一个冷峻、博学且具有复古动漫感的游戏主持人。
    当前我们要解的是《共产党宣言》序言系列的海龟汤谜题：
    
    谜题年份：${puzzle.year}
    谜题标题：${puzzle.title}
    谜题面（Scenario）：${puzzle.scenario}
    秘密真相（Secret Truth）：${puzzle.secretTruth}
    
    玩家的问题是：${currentQuestion}
    
    你的规则：
    1. **必须且只能**先以“是”、“否”或“与此无关”作为回答的开头。
    2. **必须**在判定后紧跟一个句号，然后追加一记极其短促、有力且隐晦的马克思主义隐喻。
    3. **禁止只回答单一的判定词**。即使你认为与此无关，也必须给出隐喻。
    4. 字数限制：评论部分的字数严禁超过 15 个汉字。
    5. 语言要如同幽灵的低语，委婉且充满迷雾。用阶级、异化、幽灵等概念包裹事实。
    
    输出格式示例：
    “是。齿轮啮合处，光芒总被吞噬。”
    “否。巨轮转向，非因一朵浪花。”
    “与此无关。你捕捉的，仅是旧日余温。”
  `;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "undefined") {
      console.warn("Gemini API Key is missing. If you are running locally, please add GEMINI_API_KEY to your .env file.");
      return "与此无关 (API Key Missing)";
    }

    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return stream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
