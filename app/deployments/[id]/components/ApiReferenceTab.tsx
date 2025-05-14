'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { MockDeployment } from '../types';

interface ApiReferenceTabProps {
  deployment: MockDeployment;
}

export function ApiReferenceTab({ deployment }: ApiReferenceTabProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">API Reference</h2>
        <p className="text-gray-400">Documentation and examples for integrating with Llama 2</p>
      </div>

      {/* Base URL Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-300">Base URL</h3>
        <div className="relative">
          <div className="bg-gray-900 p-3 rounded-md border border-gray-700 font-mono text-gray-300 text-sm">
            https://api.radiumdeploy.ai/v1/deployments/{deployment.id}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
            onClick={() => copyToClipboard(`https://api.radiumdeploy.ai/v1/deployments/${deployment.id}`)}
          >
            <Copy size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-500">Use this base URL for all API requests to this deployment.</p>
      </div>

      {/* Authentication Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-300">Authentication</h3>
        <div className="relative">
          <div className="bg-gray-900 p-3 rounded-md border border-gray-700 font-mono text-gray-300 text-sm">
            Authorization: Bearer YOUR_API_KEY
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
            onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
          >
            <Copy size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-500">All API requests require authentication using an API key in the header.</p>
      </div>

      {/* Endpoints Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-300">Endpoints</h3>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" variant="outline" className="bg-green-900/20 text-green-400 border-green-800 hover:bg-green-900/40">
                POST Generate
              </Button>
              <Button size="sm" variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/40">
                POST Chat
              </Button>
              <Button size="sm" variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-800 hover:bg-purple-900/40">
                POST Embeddings
              </Button>
              <Button size="sm" variant="outline" className="bg-gray-900/20 text-gray-400 border-gray-800 hover:bg-gray-900/40">
                GET Metrics
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-400 flex items-center mb-2">
                  <span className="bg-green-900/30 text-green-400 px-2 py-0.5 text-xs rounded mr-2">POST</span>
                  Generate text from a prompt
                </h4>
                <div className="text-xs font-mono text-gray-400 mb-2">https://api.radiumdeploy.ai/v1/deployments/{deployment.id}/generate</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm text-gray-300">Request Schema</h5>
                  <pre className="bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-300 overflow-auto">
{`{
  "prompt": "string",    // Required: Input prompt for the model
  "max_tokens": number,  // Maximum number of tokens to generate (default: 256)
  "temperature": number, // Randomness control (0-1, default: 0.7)
  "top_p": number        // Nucleus sampling parameter (default: 0.9)
}`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm text-gray-300">Response Schema</h5>
                  <pre className="bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-300 overflow-auto">
{`{
  "id": "string",        // Unique ID for this generation
  "model": "string",     // Model that generated the response
  "text": "string",      // Generated text response
  "usage": {
    "prompt_tokens": number,  // Number of tokens in the prompt
    "completion_tokens": number, // Number of tokens in the response
    "total_tokens": number    // Total tokens used
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm text-gray-300">Code Examples</h5>
                <div className="flex border-b border-gray-700">
                  <button className="px-3 py-1 text-xs font-medium text-sky-400 border-b-2 border-sky-400">Python</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-300">JavaScript</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-300">cURL</button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-300">Go</button>
                </div>
                <pre className="bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-300 overflow-auto">
{`import requests

API_KEY = "YOUR_API_KEY"
API_URL = "https://api.radiumdeploy.ai/v1/deployments/${deployment.id}/generate"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "prompt": "Write a poem about artificial intelligence",
    "max_tokens": 256,
    "temperature": 0.7
}

response = requests.post(API_URL, headers=headers, json=data)
result = response.json()

print(result["text"])`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
