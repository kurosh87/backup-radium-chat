// Shared types for deployment components

// Explicitly include 'failed' to ensure TypeScript recognizes it as a valid status
export type MockDeploymentStepStatus = 'pending' | 'provisioning' | 'deploying' | 'succeeded' | 'failed';

export interface MockDeployment {
  id: string;
  name: string;
  version: string;
  overallStatus: 'Healthy' | 'Degraded' | 'Offline' | 'Deploying' | 'Updating';
  uptime: string;
  totalRequests: string;
  avgLatency: string;
  errorRate: string;
  currentStepStatus: MockDeploymentStepStatus;
  progress: number;
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const initialMockData: Omit<MockDeployment, 'id' | 'currentStepStatus' | 'progress' | 'logs' | 'createdAt' | 'updatedAt'> = {
  name: 'Production Llama 2 Deployment',
  version: 'v1.23',
  overallStatus: 'Deploying', // Will change as progress updates
  uptime: '99.92% (last 24h)',
  totalRequests: '10,520',
  avgLatency: '285.30ms',
  errorRate: '0.75%',
};
