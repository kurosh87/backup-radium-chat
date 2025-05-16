'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '../../components/ui/progress'; // Using local version
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MockDeployment, MockDeploymentStepStatus } from '../types';

interface MonitoringTabProps {
  deployment: MockDeployment;
  timeLeft: number;
}

export function MonitoringTab({ deployment, timeLeft }: MonitoringTabProps) {
  const router = useRouter();
  
  const getStatusIcon = (status: MockDeploymentStepStatus) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-sky-500" />;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="w-full bg-gray-800 border-gray-700 text-gray-200 shadow-xl mb-6">
      <CardHeader className="border-b border-gray-700 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-sky-400">Deployment Pipeline</CardTitle>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${deployment.currentStepStatus === 'succeeded' ? 'bg-green-700 text-green-100' : deployment.currentStepStatus === 'failed' ? 'bg-red-700 text-red-100' : 'bg-sky-700 text-sky-100'}`}>
            {deployment.currentStepStatus.toUpperCase()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Progress: {deployment.currentStepStatus.charAt(0).toUpperCase() + deployment.currentStepStatus.slice(1)}</span>
            <span>{deployment.currentStepStatus === 'pending' || deployment.currentStepStatus === 'provisioning' || deployment.currentStepStatus === 'deploying' ? `Est. time left: ${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s` : 'Completed'}</span>
          </div>
          <Progress value={deployment.progress} className="w-full [&>div]:bg-green-500 bg-gray-700" />
          <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center">{getStatusIcon(deployment.currentStepStatus)} <span className="ml-1">{deployment.currentStepStatus.charAt(0).toUpperCase() + deployment.currentStepStatus.slice(1)}</span></span>
              <span>{deployment.progress}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">Real-time Activity Logs</h3>
          <div className="bg-gray-900 p-4 rounded-md max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 border border-gray-700">
            {deployment.logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
                {log}
              </p>
            ))}
            {(deployment.currentStepStatus === 'pending' || deployment.currentStepStatus === 'provisioning' || deployment.currentStepStatus === 'deploying') && (
              <p className="text-xs text-sky-400 font-mono animate-pulse">Awaiting next log entry...</p>
            )}
          </div>
        </div>

        {(deployment.currentStepStatus === 'succeeded' || deployment.currentStepStatus === 'failed') && (
          <div className="text-center pt-4 border-t border-gray-700 mt-6">
              <Button 
                  variant="outline"
                  onClick={() => router.push('/deploy/new')}
                  className='border-gray-600 hover:bg-gray-700 text-gray-300 mr-2'
              >
                  Deploy Another Model
              </Button>
              {deployment.currentStepStatus === 'succeeded' && 
                  <Button 
                      onClick={() => alert('Mock: Navigate to endpoint or dashboard details.')} 
                      className='bg-sky-500 hover:bg-sky-600 text-white'
                  >
                      Access Deployment
                  </Button>
              }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
