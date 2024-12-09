import React, { useState, useEffect } from 'react';
import { ScrollButton } from './theme/ThemeComponents';
import { Input } from './ui/input';
import { Wand2, AlertTriangle } from 'lucide-react';
import { llmService } from '../services/llm';
import { Checkbox } from './ui/checkbox';
import './MagicCircle.css';

interface CampaignGeneratorProps {
  onGenerated: (fields: {
    title?: string;
    description?: string;
    content?: string;
  }) => void;
  currentFields: {
    title: string;
    description: string;
    content: string;
  };
}

interface FieldSelection {
  title: boolean;
  description: boolean;
  content: boolean;
}

const MagicCircle = () => (
  <div className="magic-circle-container">
    <div className="magic-circle-outer">
      <div className="magic-sparkle"></div>
    </div>
    <div className="magic-circle-inner">
      <div className="magic-sparkle"></div>
    </div>
    <div className="magic-runes">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="magic-rune"
          style={{ transform: `rotate(${i * 45}deg) translateY(-40px)` }}
        >
          ✧
        </div>
      ))}
    </div>
    <div className="magic-glow"></div>
  </div>
);

export const CampaignGenerator = ({ onGenerated, currentFields }: CampaignGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<FieldSelection>({
    title: false,
    description: false,
    content: false
  });

  useEffect(() => {
    checkServiceAvailability();
  }, []);

  const checkServiceAvailability = async () => {
    try {
      const available = await llmService.checkAvailability();
      setIsServiceAvailable(available);
      setError(null);
    } catch (error) {
      setIsServiceAvailable(false);
      setError('Unable to connect to the AI service');
      console.error('Service availability check failed:', error);
    }
  };

const buildPrompt = (basePrompt: string, selections: FieldSelection) => {
  const MAX_CHARS_PER_FIELD = 500;
  const HEADER_LENGTH = 200;
  
  let contextPrompt = "Generate a D&D campaign with the following sections:\n\n";
  
  // Add existing content as context
  const contextFields = [];
  if (currentFields.title) {
    contextFields.push(`Current Title: "${currentFields.title}"`);
  }
  if (currentFields.description) {
    contextFields.push(`Current Campaign Hook: "${currentFields.description}"`);
  }
  if (currentFields.content) {
    contextFields.push(`Current Main Story: "${currentFields.content}"`);
  }

  // Add context if there is any
  if (contextFields.length > 0) {
    contextPrompt += "Current Content for Context:\n";
    contextPrompt += contextFields.join('\n') + '\n\n';
  }

  // Add user requirements
  contextPrompt += `User's Requirements: ${basePrompt}\n\n`;

  // Add section headers for generation
  contextPrompt += "Please generate new content for the following sections using EXACT headers:\n\n";

  if (selections.title) {
    contextPrompt += "TITLE: [Generate a creative and fitting title]\n\n";
  }
  if (selections.description) {
    contextPrompt += "CAMPAIGN HOOK: [Write a brief, engaging introduction]\n\n";
  }
  if (selections.content) {
    contextPrompt += "MAIN STORY: [Write the detailed campaign narrative]\n\n";
  }

  // Add final instruction for formatting
  contextPrompt += "Important: Each section must start with its exact header name (TITLE:, CAMPAIGN HOOK:, or MAIN STORY:) " +
                  "and the title should be on a single line.";

  // Log the final prompt for debugging
  console.log('Built prompt:', contextPrompt);

  return contextPrompt;
};
  
const handleGenerate = async () => {
  if (!prompt.trim() || !isServiceAvailable || !Object.values(selectedFields).some(v => v)) {
    return;
  }

  setIsGenerating(true);
  setError(null);
  try {
    const fullPrompt = buildPrompt(prompt, selectedFields);
    console.log('Sending prompt:', fullPrompt); // Log the prompt being sent

    const generatedText = await llmService.generateCampaign(fullPrompt);
    console.log('Raw generated text:', generatedText); // Log raw response

    // Updated title pattern matching with multiple possible formats
    const titlePattern = /(?:^|\n)(?:TITLE:|Title:)\s*([^\n]+)/;
    const titleMatch = generatedText.match(titlePattern);
    console.log('Title match result:', titleMatch); // Log match result

    // More lenient pattern matching for other sections
    const hookMatch = generatedText.match(/(?:CAMPAIGN HOOK:|Hook:)\s*([\s\S]*?)(?=\n\s*(?:MAIN STORY:|$))/i);
    const storyMatch = generatedText.match(/(?:MAIN STORY:|Story:)\s*([\s\S]*?)$/i);

    console.log('All matches:', {
      titleMatch,
      hookMatch,
      storyMatch
    });

    const generatedFields: Record<string, string> = {};

    if (selectedFields.title && titleMatch?.[1]) {
      const title = titleMatch[1].trim();
      console.log('Extracted title:', title); // Log extracted title
      generatedFields.title = title;
    }

    if (selectedFields.description && hookMatch?.[1]) {
      generatedFields.description = hookMatch[1].trim();
    }

    if (selectedFields.content && storyMatch?.[1]) {
      generatedFields.content = storyMatch[1].trim();
    }

    console.log('Generated fields:', generatedFields); // Log final fields

    if (Object.keys(generatedFields).length === 0) {
      throw new Error('No content was generated');
    }

    onGenerated(generatedFields);
    setPrompt('');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to generate campaign');
    console.error('Generation failed:', error);
  } finally {
    setIsGenerating(false);
  }
};

  if (isServiceAvailable === null) {
    return (
      <div className="generator-container">
        <p>Checking magical services availability...</p>
      </div>
    );
  }

  if (!isServiceAvailable) {
    return (
      <div className="generator-container">
        <div className="error-message">
          <AlertTriangle className="error-icon" />
          <p>The magical scroll generator is currently unavailable</p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="generator-container">
        <MagicCircle />
        <p className="generating-text">Weaving magical narratives...</p>
      </div>
    );
  }

return (
  <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513] space-y-6">
    {isGenerating ? (
      <div className="text-center space-y-4">
        <MagicCircle />
        <p className="generating-text">Weaving magical narratives...</p>
      </div>
    ) : (
      <>
        <div className="space-y-4">
          <label className="block text-lg font-serif font-bold text-[#8B4513]">
            🎲 Select Content to Generate
          </label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="title"
                checked={selectedFields.title}
                onCheckedChange={(checked) => 
                  setSelectedFields(prev => ({ ...prev, title: checked === true }))
                }
                className="border-[#8B4513] data-[state=checked]:bg-[#8B4513]"
              />
              <label htmlFor="title" className="text-[#2c1810] cursor-pointer">
                Title
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hook"
                checked={selectedFields.description}
                onCheckedChange={(checked) => 
                  setSelectedFields(prev => ({ ...prev, description: checked === true }))
                }
                className="border-[#8B4513] data-[state=checked]:bg-[#8B4513]"
              />
              <label htmlFor="hook" className="text-[#2c1810] cursor-pointer">
                Campaign Hook
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="story"
                checked={selectedFields.content}
                onCheckedChange={(checked) => 
                  setSelectedFields(prev => ({ ...prev, content: checked === true }))
                }
                className="border-[#8B4513] data-[state=checked]:bg-[#8B4513]"
              />
              <label htmlFor="story" className="text-[#2c1810] cursor-pointer">
                Main Story
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-serif font-bold text-[#8B4513]">
            📝 Magical Prompt
          </label>
          <div className="flex gap-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your campaign idea..."
              className="flex-1 bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder:text-[#8B4513]/60"
            />
            <ScrollButton
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !Object.values(selectedFields).some(v => v)}
              className="flex items-center gap-2 min-w-[120px] justify-center"
            >
              <Wand2 className="h-5 w-5" />
              Generate
            </ScrollButton>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2 bg-red-100 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <p className="text-sm text-[#8B4513] italic border-t border-[#8B4513]/20 pt-4">
          Choose the sections you wish to enchant with magical content, then describe your vision!
        </p>
      </>
    )}
  </div>
);
}
