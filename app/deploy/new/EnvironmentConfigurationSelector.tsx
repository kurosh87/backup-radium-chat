'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Select component
import { PlusCircle, Trash2 } from 'lucide-react';

interface KeyValuePair {
  id: string; // for unique key prop in React
  keyName: string;
  value: string;
}

interface EnvironmentConfigurationSelectorProps {
  environmentType: 'development' | 'staging' | 'production';
  onEnvironmentTypeChange: (value: 'development' | 'staging' | 'production') => void;
  region: string;
  onRegionChange: (value: string) => void;
  requestPriority: 'low' | 'normal' | 'high';
  onRequestPriorityChange: (value: 'low' | 'normal' | 'high') => void;
  environmentVariables: Array<{ key: string; value: string }>;
  onEnvironmentVariablesChange: (vars: Array<{ key: string; value: string }>) => void;
  secrets: Array<{ key: string; value: string }>; // Assuming secrets are handled similarly for now
  onSecretsChange: (secrets: Array<{ key: string; value: string }>) => void;
}

const regionOptions = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  // Add more as needed
];

export default function EnvironmentConfigurationSelector({
  environmentType,
  onEnvironmentTypeChange,
  region,
  onRegionChange,
  requestPriority,
  onRequestPriorityChange,
  environmentVariables,
  onEnvironmentVariablesChange,
  secrets,
  onSecretsChange,
}: EnvironmentConfigurationSelectorProps) {

  const [envVars, setEnvVars] = useState<KeyValuePair[]>(environmentVariables.map((v, i) => ({ id: `env-${i}-${Date.now()}`, keyName: v.key, value: v.value })));
  const [secVars, setSecVars] = useState<KeyValuePair[]>(secrets.map((s, i) => ({ id: `sec-${i}-${Date.now()}`, keyName: s.key, value: s.value })));

  const handleAddVar = (type: 'env' | 'secret') => {
    const newId = `${type}-${Date.now()}`;
    if (type === 'env') {
      const updatedVars = [...envVars, { id: newId, keyName: '', value: '' }];
      setEnvVars(updatedVars);
      onEnvironmentVariablesChange(updatedVars.map(v => ({ key: v.keyName, value: v.value })));
    } else {
      const updatedSecrets = [...secVars, { id: newId, keyName: '', value: '' }];
      setSecVars(updatedSecrets);
      onSecretsChange(updatedSecrets.map(s => ({ key: s.keyName, value: s.value })));
    }
  };

  const handleVarChange = (id: string, field: 'keyName' | 'value', newValue: string, type: 'env' | 'secret') => {
    if (type === 'env') {
      const updatedVars = envVars.map(v => v.id === id ? { ...v, [field]: newValue } : v);
      setEnvVars(updatedVars);
      onEnvironmentVariablesChange(updatedVars.map(v => ({ key: v.keyName, value: v.value })));
    } else {
      const updatedSecrets = secVars.map(s => s.id === id ? { ...s, [field]: newValue } : s);
      setSecVars(updatedSecrets);
      onSecretsChange(updatedSecrets.map(s => ({ key: s.keyName, value: s.value })));
    }
  };

  const handleRemoveVar = (id: string, type: 'env' | 'secret') => {
    if (type === 'env') {
      const updatedVars = envVars.filter(v => v.id !== id);
      setEnvVars(updatedVars);
      onEnvironmentVariablesChange(updatedVars.map(v => ({ key: v.keyName, value: v.value })));
    } else {
      const updatedSecrets = secVars.filter(s => s.id !== id);
      setSecVars(updatedSecrets);
      onSecretsChange(updatedSecrets.map(s => ({ key: s.keyName, value: s.value })));
    }
  };

  const renderKeyValuePairs = (pairs: KeyValuePair[], type: 'env' | 'secret') => {
    return pairs.map((pair, index) => (
      <div key={pair.id} className="flex items-center space-x-2 mb-2">
        <Input
          type="text"
          placeholder="KEY"
          value={pair.keyName}
          onChange={(e) => handleVarChange(pair.id, 'keyName', e.target.value, type)}
          className="bg-gray-700 border-gray-600 text-white flex-1"
        />
        <Input
          type={type === 'secret' ? "password" : "text"} // Basic obfuscation for secrets
          placeholder="VALUE"
          value={pair.value}
          onChange={(e) => handleVarChange(pair.id, 'value', e.target.value, type)}
          className="bg-gray-700 border-gray-600 text-white flex-1"
        />
        <Button variant="ghost" size="icon" onClick={() => handleRemoveVar(pair.id, type)} className="text-red-400 hover:text-red-300">
          <Trash2 size={18} />
        </Button>
      </div>
    ));
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="environmentType" className="text-sm font-medium text-gray-300">Environment Type</Label>
          <Select value={environmentType} onValueChange={onEnvironmentTypeChange}>
            <SelectTrigger id="environmentType" className="mt-1 w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select environment type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-white">
              <SelectItem value="development" className="hover:bg-gray-600">Development</SelectItem>
              <SelectItem value="staging" className="hover:bg-gray-600">Staging</SelectItem>
              <SelectItem value="production" className="hover:bg-gray-600">Production</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="region" className="text-sm font-medium text-gray-300">Region</Label>
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger id="region" className="mt-1 w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-white">
              {regionOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="hover:bg-gray-600">{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="requestPriority" className="text-sm font-medium text-gray-300">Request Priority</Label>
        <Select value={requestPriority} onValueChange={onRequestPriorityChange}>
          <SelectTrigger id="requestPriority" className="mt-1 w-full bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select request priority" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="low" className="hover:bg-gray-600">Low</SelectItem>
            <SelectItem value="normal" className="hover:bg-gray-600">Normal</SelectItem>
            <SelectItem value="high" className="hover:bg-gray-600">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Label className="text-sm font-medium text-gray-300 mb-2 block">Environment Variables</Label>
        {renderKeyValuePairs(envVars, 'env')}
        <Button variant="outline" onClick={() => handleAddVar('env')} className="mt-2 border-gray-600 hover:bg-gray-700 text-gray-300">
          <PlusCircle size={16} className="mr-2" /> Add Variable
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Label className="text-sm font-medium text-gray-300 mb-2 block">Secrets</Label>
        {renderKeyValuePairs(secVars, 'secret')}
        <Button variant="outline" onClick={() => handleAddVar('secret')} className="mt-2 border-gray-600 hover:bg-gray-700 text-gray-300">
          <PlusCircle size={16} className="mr-2" /> Add Secret
        </Button>
        <p className="mt-2 text-xs text-gray-400">Secrets are stored securely. Values entered here are for configuration purposes.</p>
      </div>
    </div>
  );
}
