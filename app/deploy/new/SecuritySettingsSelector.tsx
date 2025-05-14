'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw } from 'lucide-react';

interface SecuritySettingsSelectorProps {
  accessControl: 'token-authentication' | 'no-authentication';
  onAccessControlChange: (value: 'token-authentication' | 'no-authentication') => void;
  enablePrivateEndpoint: boolean;
  onEnablePrivateEndpointChange: (enabled: boolean) => void;
  enableRequestLogging: boolean;
  onEnableRequestLoggingChange: (enabled: boolean) => void;
  apiToken: string; // The actual token value
  onGenerateApiToken: () => void; // Callback to trigger token generation in parent
}

export default function SecuritySettingsSelector({
  accessControl,
  onAccessControlChange,
  enablePrivateEndpoint,
  onEnablePrivateEndpointChange,
  enableRequestLogging,
  onEnableRequestLoggingChange,
  apiToken,
  onGenerateApiToken,
}: SecuritySettingsSelectorProps) {

  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(apiToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 py-4">
      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2 block">Access Control</Label>
        <RadioGroup value={accessControl} onValueChange={onAccessControlChange} className="bg-gray-700 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-authentication" id="no-auth" className="border-gray-500 text-sky-400 focus:ring-sky-400" />
            <Label htmlFor="no-auth" className="text-gray-300">No Authentication</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="token-authentication" id="token-auth" className="border-gray-500 text-sky-400 focus:ring-sky-400" />
            <Label htmlFor="token-auth" className="text-gray-300">Token-based Authentication</Label>
          </div>
        </RadioGroup>
      </div>

      {accessControl === 'token-authentication' && (
        <div className="pt-4 border-t border-gray-700">
          <Label htmlFor="apiToken" className="text-sm font-medium text-gray-300">API Token</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="apiToken"
              type="text"
              value={apiToken}
              readOnly
              placeholder="Click 'Generate' to create a token"
              className="bg-gray-800 border-gray-600 text-gray-400 flex-1"
            />
            <Button variant="outline" size="icon" onClick={onGenerateApiToken} className="border-gray-600 hover:bg-gray-700 text-gray-300">
              <RefreshCw size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopyToClipboard} disabled={!apiToken} className="border-gray-600 hover:bg-gray-700 text-gray-300">
              {copied ? <span className="text-xs">Copied!</span> : <Copy size={16} />}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-400">Securely store this token. It will not be shown again after you navigate away.</p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <Label htmlFor="privateEndpoint" className="text-sm font-medium text-gray-300">Enable Private Endpoint</Label>
          <Switch
            id="privateEndpoint"
            checked={enablePrivateEndpoint}
            onCheckedChange={onEnablePrivateEndpointChange}
            className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-gray-600"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">Make the endpoint accessible only within your private network.</p>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <Label htmlFor="requestLogging" className="text-sm font-medium text-gray-300">Enable Request Logging</Label>
          <Switch
            id="requestLogging"
            checked={enableRequestLogging}
            onCheckedChange={onEnableRequestLoggingChange}
            className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-gray-600"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">Log incoming requests to the endpoint for monitoring and debugging.</p>
      </div>
    </div>
  );
}
