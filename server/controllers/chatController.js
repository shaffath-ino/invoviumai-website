import User from '../models/User.js';
import config from '../../config.js';

export const handleChat = async (req, res) => {
  try {
    const { messages, userName } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // 1. Give DB Access: Query live data intelligently
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ accountType: 'student' });
    const companyCount = await User.countDocuments({ accountType: 'company' });

    // 2. Inject DB context into the chatbot's system brain
    const systemInstruction = {
      role: 'system',
      content: `You are the InoviumAI Virtual Assistant. You ALREADY have direct read-access to the live internal database cluster. 
      CURRENT LIVE DATABASE STATUS: 
      - Total Registered Accounts: ${totalUsers}
      - Student Accounts: ${studentCount}
      - Enterprise/Company Accounts: ${companyCount}
      
      The person currently speaking to you is logged in as: ${userName || 'Guest User'}. Address them by their name occasionally.
      
      YOUR COMMUNICATION STYLE & RULES:
      1. Keep your responses EXTREMELY short and concise (1-3 sentences maximum).
      2. If a student asks a technical or coding question, DO NOT give them the direct answer.
      3. Instead, act as a Socratic tutor: teach them the underlying concept or ask them a guiding question to help them figure it out themselves.
      4. Use structured Markdown (bolding) and appropriate emojis.
      5. Only give direct answers for administrative queries (e.g., about InoviumAI services, stats, or account issues).`
    };

    const conversation = [systemInstruction, ...messages];

    // 3. Connect to AI Engine
    const apiKey = config.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Backend Groq API key is missing in .env layer.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: conversation
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Groq Backend Connect Error:", errData);
      return res.status(500).json({ error: 'LLM Engine Failure' });
    }

    const data = await response.json();
    const botResponse = data.choices[0]?.message?.content || "I couldn't process that database query.";

    res.status(200).json({ reply: botResponse });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal system fault.' });
  }
};
