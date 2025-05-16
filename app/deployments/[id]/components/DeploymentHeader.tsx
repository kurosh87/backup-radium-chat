'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, PlayCircle, StopCircle } from 'lucide-react';
import { MockDeployment } from '../types';

interface DeploymentHeaderProps {
  deployment: MockDeployment;
}

export function DeploymentHeader({ deployment }: DeploymentHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{deployment.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className={`border-${deployment.overallStatus === 'Healthy' ? 'green' : deployment.overallStatus === 'Deploying' || deployment.overallStatus === 'Updating' ? 'sky' : 'yellow'}-500 text-${deployment.overallStatus === 'Healthy' ? 'green' : deployment.overallStatus === 'Deploying' || deployment.overallStatus === 'Updating' ? 'sky' : 'yellow'}-400 bg-opacity-20`}>{deployment.overallStatus}</Badge>
            <span className="text-sm text-gray-400">{deployment.version}</span>
            <span className="text-sm text-gray-500">ID: <span className='font-mono'>{deployment.id}</span></span>
          </div>
        </div>
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700"><Copy size={16} className="mr-1"/> Clone</Button>
          <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700"><PlayCircle size={16} className="mr-1"/> Restart</Button>
          <Button variant="outline" size="sm" className="border-red-800 hover:bg-red-900/20 text-red-400"><StopCircle size={16} className="mr-1"/> Stop</Button>
        </div>
      </div>
    </header>
  );
}
