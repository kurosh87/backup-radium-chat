'use client';

import { ChatHeader } from '@/components/chat-header';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useModelStore } from '@/hooks/use-model-store';
import { RocketIcon, ServerIcon, CodeIcon } from 'lucide-react';
import Link from 'next/link';

export default function DeployDashboardPage() {
  const { models } = useModelStore();
  const defaultModelId = models[0]?.id || 'unknown';

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chatId="deploy-dashboard"
        selectedModelId={defaultModelId}
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="mb-0">
            <PageHeader
              title="Model Deployment"
              description="Deploy, manage, and monitor your AI models with Radium Cloud."
            />
          </div>
          <Link href="/deploy/models" passHref>
            <Button>Deploy a Model</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-muted/30 dark:bg-muted/10 border-dashed border-primary/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with model deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button className="flex items-center gap-2" asChild>
                  <Link href="/deploy/models">
                    <RocketIcon className="w-4 h-4" />
                    Deploy a New Model
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ServerIcon className="w-4 h-4" />
                  Manage Deployments
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <CodeIcon className="w-4 h-4" />
                  API Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Deployment Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Deployments</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/deploy/models">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* No deployments state */}
                <Card className="col-span-1 md:col-span-2 py-6">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <ServerIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No active deployments
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven&apos;t deployed any models yet. Deploy your first
                      model to get started.
                    </p>
                    <Button asChild>
                      <Link href="/deploy/models">Deploy Your First Model</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Sidebar Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Working with deployments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Model deployment lets you host AI models on Radium Cloud for
                  integration into your applications through REST APIs and SDKs.
                  Our platform handles scaling, monitoring, and optimization.
                </p>
                <Separator />
                <h4 className="font-semibold text-foreground">
                  Deployment Process:
                </h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Select a pre-trained or fine-tuned model</li>
                  <li>
                    Configure deployment settings (scaling, compute, etc.)
                  </li>
                  <li>Deploy the model with one click</li>
                  <li>Access your model via API endpoints</li>
                </ol>
                <Separator />
                <h4 className="font-semibold text-foreground">
                  Benefits of Deployment:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Simplified infrastructure management</li>
                  <li>Auto-scaling for cost optimization</li>
                  <li>High availability and fault tolerance</li>
                  <li>Real-time monitoring and observability</li>
                  <li>Pay only for what you use</li>
                </ul>
                <Separator />
                <p className="text-xs italic">
                  Deployments can be managed via the dashboard or using our
                  <code className="font-mono text-foreground bg-muted px-1 py-0.5 rounded">
                    radium-cli
                  </code>
                  command-line tool for advanced configuration and CI/CD
                  integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
