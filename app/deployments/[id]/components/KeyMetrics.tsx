'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Clock, AlertCircle, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { MockDeployment } from '../types';

interface KeyMetricsProps {
  deployment: MockDeployment;
}

export function KeyMetrics({ deployment }: KeyMetricsProps) {
  const getStatusIcon = (status: MockDeployment['overallStatus']) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Offline':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-sky-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Overall Status</CardTitle>
          {getStatusIcon(deployment.overallStatus)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{deployment.overallStatus}</div>
          <p className="text-xs text-gray-500">{deployment.uptime}</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
          <BarChart2 className="h-5 w-5 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{deployment.totalRequests}</div>
          <p className="text-xs text-gray-500">Last 24 hours</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Avg. Latency</CardTitle>
          <Clock className="h-5 w-5 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{deployment.avgLatency}</div>
          <p className="text-xs text-gray-500">P95: {parseFloat(deployment.avgLatency) * 1.85}ms</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Error Rate</CardTitle>
          <AlertCircle className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{deployment.errorRate}</div>
          <p className="text-xs text-gray-500">Last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  );
}
