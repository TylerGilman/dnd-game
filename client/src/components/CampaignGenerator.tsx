// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
    let contextPrompt = "Generate a D&D campaign with the following sections:\n\n";
    
    // Add existing content as context
    if (currentFields.title) {
      contextPrompt += `Title: "${currentFields.title}"\n`;
    }
    if (currentFields.description) {
      contextPrompt += `Current Campaign Hook: "${currentFields.description}"\n`;
    }
    if (currentFields.content) {
      contextPrompt += `Current Main Story: "${currentFields.content}"\n`;
    }

    // Add user requirements
    contextPrompt += `\nUser's Requirements: ${basePrompt}\n\n`;
    contextPrompt += "Please generate new content for the following sections using EXACT headers:\n\n";

    if (selections.description) {
      contextPrompt += "CAMPAIGN HOOK: [Write a brief, engaging introduction]\n\n";
    }
    if (selections.content) {
      contextPrompt += "MAIN STORY: [Write the detailed campaign narrative]\n\n";
    }

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
      const generatedText = await llmService.generateCampaign(fullPrompt);
      
      const hookMatch = generatedText.match(/CAMPAIGN HOOK:\s*([\s\S]*?)(?=MAIN STORY:|$)/i);
      const storyMatch = generatedText.match(/MAIN STORY:\s*([\s\S]*?)$/i);

      const generatedFields = {
        ...(selectedFields.description && hookMatch?.[1] && { 
          description: hookMatch[1].trim() 
        }),
        ...(selectedFields.content && storyMatch?.[1] && { 
          content: storyMatch[1].trim() 
        })
      };

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
};
