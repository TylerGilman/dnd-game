// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// /client/src/services/llm.ts

const HUGGINGFACE_API_URL = `${import.meta.env.VITE_HUGGINGFACE_API_URL}/chat/completions`;
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface LLMServiceStatus {
  isAvailable: boolean;
  lastChecked: number;
}

let serviceStatus: LLMServiceStatus = {
  isAvailable: false,
  lastChecked: 0
};

export const llmService = {
  async checkAvailability(): Promise<boolean> {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    
    if (now - serviceStatus.lastChecked < CACHE_DURATION) {
      return serviceStatus.isAvailable;
    }

    try {
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tgi",
          messages: [{ role: "user", content: "test" }],
          max_tokens: 1
        })
      });

      serviceStatus = {
        isAvailable: response.ok,
        lastChecked: now
      };
      
      return response.ok;
    } catch (error) {
      console.error('LLM service availability check failed:', error);
      serviceStatus = {
        isAvailable: false,
        lastChecked: now
      };
      return false;
    }
  },

  async generateCampaign(prompt: string): Promise<string> {
    try {
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tgi",
          messages: [{
            role: "user",
            content: `Create a D&D campaign with the following prompt: ${prompt}

            Please structure your response exactly as follows:

            CAMPAIGN HOOK:
            [Write a brief, engaging introduction to hook players]

            MAIN STORY:
            [Write the detailed campaign narrative]

            Make it creative and engaging, suitable for a D&D adventure.`
          }],
          max_tokens: 1000,
          temperature: 0.8,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Generation failed:', errorText);
        throw new Error('Failed to generate campaign');
      }

      const data: CompletionResponse = await response.json();
      const generatedText = data.choices[0]?.message?.content;

      if (!generatedText) {
        throw new Error('No text was generated');
      }

      return generatedText;
    } catch (error) {
      console.error('Campaign generation error:', error);
      throw error;
    }
  }
};
