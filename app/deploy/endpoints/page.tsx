'use client';

import { ChatHeader } from '@/components/chat-header';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useModelStore } from '@/hooks/use-model-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import {
  SearchIcon,
  PlusIcon,
  ServerIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  PlayIcon,
} from 'lucide-react';
import { useState } from 'react';

// Example data
const endpoints = [
  {
    id: 'endpoint-1',
    name: 'Production API',
    modelId: 'llama-2-7b',
    modelName: 'Llama 2 7B Chat',
    status: 'Active',
    latency: '142ms',
    usage: '124K / day',
    createdAt: '2024-05-01',
    url: 'https://api.radium.cloud/v1/models/llama-2-7b',
  },
  {
    id: 'endpoint-2',
    name: 'Support Chatbot',
    modelId: 'deepseek-r1',
    modelName: 'DeepSeek R1',
    status: 'Active',
    latency: '112ms',
    usage: '45K / day',
    createdAt: '2024-05-03',
    url: 'https://api.radium.cloud/v1/models/deepseek-r1',
  },
  {
    id: 'endpoint-3',
    name: 'Medical Assistant',
    modelId: 'llama-2-7b-custom',
    modelName: 'Llama 2 7B (Fine-tuned)',
    status: 'Provisioning',
    latency: '150ms',
    usage: '0 / day',
    createdAt: '2024-05-09',
    url: 'https://api.radium.cloud/v1/models/llama-2-7b-custom',
  },
];

export default function EndpointsPage() {
  const { models } = useModelStore();
  const defaultModelId = models[0]?.id || 'unknown';
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chatId="deploy-endpoints"
        selectedModelId={defaultModelId}
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Model Endpoints"
            description="Deploy and manage API endpoints for your models"
          />
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Endpoint
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 w-full max-w-sm relative">
            <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search endpoints..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="provisioning">Provisioning</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Avg. Latency</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell className="font-medium">
                      {endpoint.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`
                          ${
                            endpoint.status === 'Active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : endpoint.status === 'Provisioning'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          }
                        `}
                        variant="outline"
                      >
                        {endpoint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{endpoint.modelName}</TableCell>
                    <TableCell>{endpoint.latency}</TableCell>
                    <TableCell>{endpoint.usage}</TableCell>
                    <TableCell>{endpoint.createdAt}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                      <div className="flex items-center gap-1">
                        <span className="truncate">{endpoint.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => copyToClipboard(endpoint.url)}
                        >
                          {copiedUrl === endpoint.url ? (
                            <CheckIcon className="h-3 w-3 text-green-500" />
                          ) : (
                            <CopyIcon className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Endpoint Performance</CardTitle>
            <CardDescription>
              Request volume and latency metrics for your endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">
                Performance charts will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Endpoint Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">169,452</div>
              <p className="text-xs text-muted-foreground">
                +8.3% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135ms</div>
              <p className="text-xs text-muted-foreground">
                -12ms from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
