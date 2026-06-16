import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export const generateWellnessResponse = async (userPrompt, userContext = '') => {
  try {
    const model = getGeminiModel();

    const systemPrompt = `You are InnerLight, a compassionate AI wellness assistant. You provide supportive, non-medical mental health guidance. 
    
Guidelines:
- Be empathetic and understanding
- Provide practical wellness tips
- Suggest breathing exercises, meditation, journaling prompts
- Encourage professional help when needed
- Keep responses concise (2-3 paragraphs)
- Use warm, supportive tone
- Never diagnose or prescribe medication`;

    const fullPrompt = userContext 
      ? `${systemPrompt}\n\nUser Context: ${userContext}\n\nUser: ${userPrompt}`
      : `${systemPrompt}\n\nUser: ${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate wellness response');
  }
};

export const generateBreathingExercise = async (duration = 5, focusArea = 'general') => {
  try {
    const model = getGeminiModel();
    
    const prompt = `Create a guided ${duration}-minute breathing exercise for ${focusArea} wellness. 
    Format as steps with exact timing. Include: Preparation, Exercise steps, Closing. Keep it simple and calming.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating breathing exercise:', error);
    throw new Error('Failed to generate breathing exercise');
  }
};

export const generateMoodInsight = async (moodHistory) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `Analyze this mood tracking history and provide brief wellness insights: ${JSON.stringify(moodHistory)}. 
    Suggest 2-3 actionable wellness tips based on patterns.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating mood insight:', error);
    throw new Error('Failed to generate mood insight');
  }
};