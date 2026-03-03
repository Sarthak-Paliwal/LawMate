const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.getChatCompletion = async (messages) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Updated non-deprecated model
      messages,
      temperature: 0.3, // lower for legal accuracy
      max_tokens: 2048,
      top_p: 0.9,
      stream: false,
    });

    return chatCompletion.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
};
