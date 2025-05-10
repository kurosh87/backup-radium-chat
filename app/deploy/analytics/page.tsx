'use client';

import { ChatHeader } from '@/components/chat-header';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useModelStore } from '@/hooks/use-model-store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample data for demonstration
const requestsData = [
  { time: '00:00', requests: 12, errors: 1 },
  { time: '02:00', requests: 8, errors: 0 },
  { time: '04:00', requests: 5, errors: 0 },
  { time: '06:00', requests: 10, errors: 0 },
  { time: '08:00', requests: 18, errors: 1 },
  { time: '10:00', requests: 25, errors: 2 },
  { time: '12:00', requests: 30, errors: 1 },
  { time: '14:00', requests: 28, errors: 0 },
  { time: '16:00', requests: 35, errors: 3 },
  { time: '18:00', requests: 32, errors: 1 },
  { time: '20:00', requests: 20, errors: 0 },
  { time: '22:00', requests: 15, errors: 0 },
];

const latencyData = [
  { time: '00:00', average: 120, p95: 180, p99: 240 },
  { time: '02:00', average: 125, p95: 190, p99: 250 },
  { time: '04:00', average: 110, p95: 170, p99: 230 },
  { time: '06:00', average: 130, p95: 200, p99: 260 },
  { time: '08:00', average: 140, p95: 210, p99: 270 },
  { time: '10:00', average: 150, p95: 220, p99: 280 },
  { time: '12:00', average: 160, p95: 240, p99: 300 },
  { time: '14:00', average: 155, p95: 230, p99: 290 },
  { time: '16:00', average: 165, p95: 250, p99: 310 },
  { time: '18:00', average: 150, p95: 225, p99: 295 },
  { time: '20:00', average: 140, p95: 210, p99: 275 },
  { time: '22:00', average: 130, p95: 195, p99: 260 },
];

const modelUsageData = [
  { name: 'Llama 2 7B', value: 45 },
  { name: 'Llama 2 13B', value: 20 },
  { name: 'DeepSeek R', value: 25 },
  { name: 'Qwen 32B', value: 10 },
];

const tokenUsageData = [
  { day: 'Monday', input: 1200000, output: 1800000 },
  { day: 'Tuesday', input: 1100000, output: 1700000 },
  { day: 'Wednesday', input: 1300000, output: 1900000 },
  { day: 'Thursday', input: 1400000, output: 2100000 },
  { day: 'Friday', input: 1500000, output: 2300000 },
  { day: 'Saturday', input: 900000, output: 1400000 },
  { day: 'Sunday', input: 800000, output: 1200000 },
];

export default function AnalyticsDashboardPage() {
  const { models } = useModelStore();
  const defaultModelId = models[0]?.id || 'unknown';

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chatId="analytics-dashboard"
        selectedModelId={defaultModelId}
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Analytics Dashboard"
            description="Monitor your model performance, usage, and metrics"
          />
          <div className="flex gap-2">
            <Select defaultValue="24">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Hours</SelectItem>
                <SelectItem value="12">12 Hours</SelectItem>
                <SelectItem value="24">24 Hours</SelectItem>
                <SelectItem value="48">48 Hours</SelectItem>
                <SelectItem value="168">7 Days</SelectItem>
                <SelectItem value="720">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">256,328</div>
                  <p className="text-xs text-muted-foreground">
                    +12.4% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.6%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">145ms</div>
                  <p className="text-xs text-muted-foreground">
                    -5ms from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$256.78</div>
                  <p className="text-xs text-muted-foreground">
                    +$32.40 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Requests & Errors</CardTitle>
                  <CardDescription>
                    Total requests and errors over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={requestsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="requests"
                          name="Requests"
                          stroke="#4F46E5"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="errors"
                          name="Errors"
                          stroke="#EF4444"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Latency</CardTitle>
                  <CardDescription>
                    Average, P95, and P99 latency over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="average"
                          name="Average"
                          stroke="#4F46E5"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="p95"
                          name="P95"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="p99"
                          name="P99"
                          stroke="#C084FC"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* More Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Model Usage</CardTitle>
                  <CardDescription>
                    Distribution of requests by model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={modelUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Requests" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Token Usage</CardTitle>
                  <CardDescription>
                    Input and output tokens over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tokenUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="input"
                          name="Input Tokens"
                          fill="#4F46E5"
                        />
                        <Bar
                          dataKey="output"
                          name="Output Tokens"
                          fill="#8B5CF6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed performance metrics will be available here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This tab will contain more detailed performance metrics for
                  your deployed models.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Metrics</CardTitle>
                <CardDescription>
                  Detailed usage metrics will be available here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This tab will contain more detailed usage metrics for your
                  deployed models.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>
                  Detailed cost analysis will be available here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This tab will contain a detailed breakdown of costs for your
                  deployed models.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
