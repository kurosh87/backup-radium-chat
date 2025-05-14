'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { MockDeployment } from '../types';

interface TestTabProps {
  deployment: MockDeployment;
}

export function TestTab({ deployment }: TestTabProps) {
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(100);
  const [topP, setTopP] = useState(0.9);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResponse('');
    
    // Mock generation with typing effect
    let fullResponse = "This is a simulated response from the Llama 2 model based on your prompt. In a real deployment, this would contain the actual model output. The response would vary based on the parameters you've set:\n\n";
    fullResponse += `- Temperature: ${temperature} (higher values make output more random)\n`;
    fullResponse += `- Max Tokens: ${maxTokens} (controls response length)\n`;
    fullResponse += `- Top P: ${topP} (nucleus sampling parameter)\n\n`;
    fullResponse += "Your prompt was about: " + prompt.substring(0, 20) + "...\n\n";
    fullResponse += "The model would generate a thoughtful response here, taking into account all the context and instructions in your prompt.";
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setResponse(prev => prev + fullResponse.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Model Playground</CardTitle>
          <p className="text-sm text-gray-400">Test your deployment with different inputs and parameters</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Temperature</label>
              <div className="flex items-center space-x-2">
                <Slider 
                  value={[temperature]} 
                  min={0} 
                  max={1} 
                  step={0.1} 
                  onValueChange={(vals) => setTemperature(vals[0])}
                  className="flex-grow"
                />
                <span className="text-sm font-mono w-8 text-right text-gray-300">{temperature}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Tokens</label>
              <Input 
                type="number" 
                value={maxTokens} 
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="bg-gray-900 border-gray-700 text-gray-300"
                min={1}
                max={2048}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Top P</label>
              <div className="flex items-center space-x-2">
                <Slider 
                  value={[topP]} 
                  min={0} 
                  max={1} 
                  step={0.1} 
                  onValueChange={(vals) => setTopP(vals[0])}
                  className="flex-grow"
                />
                <span className="text-sm font-mono w-8 text-right text-gray-300">{topP}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Prompt</label>
            <Textarea 
              placeholder="Enter your prompt here..."
              className="bg-gray-900 border-gray-700 text-gray-300 min-h-[120px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : 'Test Model'}
          </Button>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Response</label>
            <div className="bg-gray-900 border border-gray-700 rounded-md p-4 min-h-[200px] text-gray-300 font-mono text-sm whitespace-pre-wrap">
              {response || 'Response will appear here...'}
              {isGenerating && <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse"></span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
