'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Plus } from 'lucide-react';
import { MockDeployment } from '../types';

interface ApiKeysTabProps {
  deployment: MockDeployment;
}

export function ApiKeysTab({ deployment }: ApiKeysTabProps) {
  const [hasKeys, setHasKeys] = React.useState(false);

  const handleCreateKey = () => {
    setHasKeys(true);
    alert('Mock: API Key created');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">API Keys</h2>
          <p className="text-sm text-gray-400">Manage API keys for this deployment</p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleCreateKey}>
          <Plus size={16} className="mr-1" /> Create New Key
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Active API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {hasKeys ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-750 rounded-md border border-gray-700">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-sky-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-200">Production API Key</div>
                    <div className="text-xs text-gray-400">Created just now • Last used: Never</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700 text-gray-300">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-300 mb-1">No API keys found</h3>
              <p className="text-sm text-gray-500 mb-4">Create an API key to access this deployment</p>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleCreateKey}>
                <Plus size={16} className="mr-1" /> Create New Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
