'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Activity, Code, Terminal, Key, Bell, Settings } from 'lucide-react';

// Import modular components
import { DeploymentHeader } from './components/DeploymentHeader';
import { KeyMetrics } from './components/KeyMetrics';
import { MonitoringTab } from './components/MonitoringTab';
import { ApiReferenceTab } from './components/ApiReferenceTab';
import { TestTab } from './components/TestTab';
import { ApiKeysTab } from './components/ApiKeysTab';

// Import types
import { MockDeployment, MockDeploymentStepStatus, initialMockData } from './types';



export default function DeploymentStatusPage() {
  const params = useParams();
  const deploymentId = params.id as string;

  const [activeTab, setActiveTab] = React.useState('monitoring');
  const [deployment, setDeployment] = React.useState<MockDeployment | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(180); // Increased mock time

  React.useEffect(() => {
    if (!deploymentId) return;

    const initialDeployment: MockDeployment = {
      ...initialMockData,
      id: deploymentId,
      currentStepStatus: 'pending',
      progress: 0,
      logs: [`[${new Date().toLocaleTimeString()}] Deployment process initiated for: ${deploymentId} (${initialMockData.name})`],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDeployment(initialDeployment);

    let currentProgress = 0;
    let currentStatus: MockDeploymentStepStatus = 'pending';
    const logsBuffer: string[] = [...initialDeployment.logs];
    let remainingTime = 180;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 8;
      remainingTime -= (180 / (100 / (Math.random() * 8))); 
      setTimeLeft(Math.max(0, Math.round(remainingTime)));

      if (currentProgress < 15) {
        currentStatus = 'pending';
        logsBuffer.push(`[${new Date().toLocaleTimeString()}] Status: Queued. Awaiting resource allocation...`);
      } else if (currentProgress < 45) {
        currentStatus = 'provisioning';
        logsBuffer.push(`[${new Date().toLocaleTimeString()}] Status: Provisioning dedicated infrastructure...`);
        setDeployment(prev => prev ? {...prev, overallStatus: 'Deploying'} : null);
      } else if (currentProgress < 85) {
        currentStatus = 'deploying';
        logsBuffer.push(`[${new Date().toLocaleTimeString()}] Status: Deploying model image and configuring network...`);
        setDeployment(prev => prev ? {...prev, overallStatus: 'Updating'} : null);
      } else {
        currentStatus = 'succeeded';
        logsBuffer.push(`[${new Date().toLocaleTimeString()}] Status: Deployment Succeeded! Endpoint is live and healthy.`);
        currentProgress = 100;
        setTimeLeft(0);
        setDeployment(prev => prev ? {...prev, overallStatus: 'Healthy'} : null);
        clearInterval(interval);
      }

      setDeployment(prev => prev ? {
        ...prev,
        currentStepStatus: currentStatus,
        progress: Math.min(100, Math.round(currentProgress)),
        logs: [...logsBuffer].slice(-15), // Show more logs
        updatedAt: new Date(),
      } : null);

      // Clear interval when deployment is complete
      if (currentStatus === 'succeeded') {
        clearInterval(interval);
      }
    }, 2500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, [deploymentId]);

  if (!deployment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sky-400 flex items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Deployment Cockpit...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Fetching details for deployment ID: <span className='font-mono'>{deploymentId}</span></p>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8 text-gray-200">
      {/* Header */}
      <DeploymentHeader deployment={deployment} />

      {/* Key Metrics */}
      <KeyMetrics deployment={deployment} />

      {/* Tabs */}
      <Tabs defaultValue="monitoring" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-b border-gray-700 p-0 h-auto w-full rounded-none justify-start">
          <TabsTrigger 
            value="monitoring" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Loader2 className="h-4 w-4 mr-2" /> Monitoring
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Activity className="h-4 w-4 mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="api-reference" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Code className="h-4 w-4 mr-2" /> API Reference
          </TabsTrigger>
          <TabsTrigger 
            value="test" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Terminal className="h-4 w-4 mr-2" /> Test
          </TabsTrigger>
          <TabsTrigger 
            value="api-keys" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Key className="h-4 w-4 mr-2" /> API Keys
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:text-sky-400 rounded-none px-4 py-2"
          >
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitoring" className="mt-6">
          <MonitoringTab deployment={deployment} timeLeft={timeLeft} />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-300 mb-1">Analytics Dashboard</h3>
                <p className="text-sm text-gray-500">Detailed metrics and usage patterns for this deployment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-reference" className="mt-6">
          <ApiReferenceTab deployment={deployment} />
        </TabsContent>
        
        <TabsContent value="test" className="mt-6">
          <TestTab deployment={deployment} />
        </TabsContent>
        
        <TabsContent value="api-keys" className="mt-6">
          <ApiKeysTab deployment={deployment} />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-300 mb-1">Notification Settings</h3>
                <p className="text-sm text-gray-500">Configure how you want to receive deployment notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Deployment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-300 mb-1">Deployment Configuration</h3>
                <p className="text-sm text-gray-500">Configure your deployment resources and parameters</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
