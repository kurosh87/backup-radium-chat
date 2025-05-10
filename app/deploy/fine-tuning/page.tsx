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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import {
  FileIcon,
  FilePlus2Icon,
  SearchIcon,
  Clock,
  ClipboardEdit,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

// Sample data for fine-tuning jobs
const finetuningJobs = [
  {
    id: 'ft-8765432',
    baseModel: 'Llama 2 7B',
    suffix: 'medical-assistant',
    type: 'SFT',
    status: 'Completed',
    runtime: '5h 23m',
    created: '2024-05-01',
  },
  {
    id: 'ft-9876543',
    baseModel: 'Llama 2 13B',
    suffix: 'code-assistant',
    type: 'SFT',
    status: 'Running',
    runtime: '2h 45m',
    created: '2024-05-05',
  },
  {
    id: 'ft-1234567',
    baseModel: 'DeepSeek R1',
    suffix: 'finance-advisor',
    type: 'DPO',
    status: 'Failed',
    runtime: '0h 37m',
    created: '2024-05-07',
  },
];

// Form schema
const formSchema = z.object({
  baseModel: z.string({
    required_error: 'Please select a base model.',
  }),
  suffix: z.string().min(3, {
    message: 'Suffix must be at least 3 characters.',
  }),
  trainingFile: z.string().min(1, {
    message: 'Please select a training file.',
  }),
  validationFile: z.string().optional(),
  epochs: z.preprocess((val) => Number(val), z.number().min(1).max(10)),
  batchSize: z.preprocess((val) => Number(val), z.number().min(1).max(64)),
  learningRate: z.string(),
  useLoRA: z.boolean().default(true),
});

export default function FineTuningPage() {
  const { models } = useModelStore();
  const defaultModelId = models[0]?.id || 'unknown';

  // State for the form
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseModel: '',
      suffix: '',
      trainingFile: '',
      validationFile: '',
      epochs: 3,
      batchSize: 8,
      learningRate: '2e-5',
      useLoRA: true,
    },
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(values);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      // Here you would typically redirect to the jobs list after a successful submission
    }, 2000);
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chatId="fine-tuning-dashboard"
        selectedModelId={defaultModelId}
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Fine-tuning Jobs"
            description="Create and manage your fine-tuning jobs"
          />
          <Button asChild>
            <Link href="/deploy/fine-tuning/create">
              <FilePlus2Icon className="mr-2 h-4 w-4" />
              New Fine-tuning Job
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="jobs">
          <TabsList className="mb-4">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm relative">
                <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Base Model</TableHead>
                      <TableHead>Suffix</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Run Time</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finetuningJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-xs">
                          {job.id}
                        </TableCell>
                        <TableCell>{job.baseModel}</TableCell>
                        <TableCell>{job.suffix}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-xs inline-block 
                            ${
                              job.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'Running'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {job.status}
                          </div>
                        </TableCell>
                        <TableCell>{job.runtime}</TableCell>
                        <TableCell>{job.created}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Fine-tuning Job</CardTitle>
                <CardDescription>
                  Customize a pre-trained model for your specific use case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="baseModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Model</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a model" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="llama-2-7b">
                                    Llama 2 7B
                                  </SelectItem>
                                  <SelectItem value="llama-2-13b">
                                    Llama 2 13B
                                  </SelectItem>
                                  <SelectItem value="deepseek-r1">
                                    DeepSeek R1
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The foundation model to fine-tune
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="suffix"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Model Suffix</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., medical-assistant"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                A unique identifier for this fine-tuned model
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="trainingFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Training Data</FormLabel>
                              <div className="flex items-center gap-2">
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="Select a training file" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="medical-dataset.jsonl">
                                      medical-dataset.jsonl
                                    </SelectItem>
                                    <SelectItem value="customer-support.jsonl">
                                      customer-support.jsonl
                                    </SelectItem>
                                    <SelectItem value="code-examples.jsonl">
                                      code-examples.jsonl
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="outline" type="button">
                                  <FileIcon className="h-4 w-4 mr-2" />
                                  Upload
                                </Button>
                              </div>
                              <FormDescription>
                                JSONL file with training examples
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="validationFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Validation Data (Optional)</FormLabel>
                              <div className="flex items-center gap-2">
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="Select a validation file" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="medical-val.jsonl">
                                      medical-val.jsonl
                                    </SelectItem>
                                    <SelectItem value="customer-support-val.jsonl">
                                      customer-support-val.jsonl
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="outline" type="button">
                                  <FileIcon className="h-4 w-4 mr-2" />
                                  Upload
                                </Button>
                              </div>
                              <FormDescription>
                                JSONL file with validation examples
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg space-y-3">
                          <h3 className="font-medium flex items-center gap-2">
                            <ClipboardEdit className="h-4 w-4" />
                            Advanced Training Parameters
                          </h3>
                          <Separator />

                          <FormField
                            control={form.control}
                            name="epochs"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between">
                                  <FormLabel>Epochs</FormLabel>
                                  <span className="text-xs text-muted-foreground">
                                    {field.value} epochs
                                  </span>
                                </div>
                                <FormControl>
                                  <Input
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="w-full"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Number of training passes through the dataset
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="batchSize"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between">
                                  <FormLabel>Batch Size</FormLabel>
                                  <span className="text-xs text-muted-foreground">
                                    {field.value} examples
                                  </span>
                                </div>
                                <FormControl>
                                  <Input
                                    type="range"
                                    min={1}
                                    max={64}
                                    step={1}
                                    className="w-full"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Number of examples processed at once
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="learningRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Learning Rate</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2e-5" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Step size for parameter updates
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="useLoRA"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Use LoRA Adaptation</FormLabel>
                                  <FormDescription>
                                    Recommended for faster training and lower
                                    resource usage
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="p-4 bg-primary/5 rounded-lg">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Estimated Resources
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Training Time:</span>
                              <span className="font-medium">~2-4 hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Compute Cost:</span>
                              <span className="font-medium">$15-25</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GPU Memory:</span>
                              <span className="font-medium">16 GB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Start Fine-tuning
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm relative">
                <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search datasets..." className="pl-9" />
              </div>
              <Button>
                <FileIcon className="mr-2 h-4 w-4" />
                Upload Dataset
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Datasets</CardTitle>
                <CardDescription>
                  Manage your training and validation datasets
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Examples</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        medical-dataset.jsonl
                      </TableCell>
                      <TableCell>Training</TableCell>
                      <TableCell>2.4 MB</TableCell>
                      <TableCell>1,520</TableCell>
                      <TableCell>2024-05-01</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        medical-val.jsonl
                      </TableCell>
                      <TableCell>Validation</TableCell>
                      <TableCell>0.5 MB</TableCell>
                      <TableCell>300</TableCell>
                      <TableCell>2024-05-01</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        customer-support.jsonl
                      </TableCell>
                      <TableCell>Training</TableCell>
                      <TableCell>3.8 MB</TableCell>
                      <TableCell>2,450</TableCell>
                      <TableCell>2024-04-20</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        customer-support-val.jsonl
                      </TableCell>
                      <TableCell>Validation</TableCell>
                      <TableCell>0.7 MB</TableCell>
                      <TableCell>500</TableCell>
                      <TableCell>2024-04-20</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        code-examples.jsonl
                      </TableCell>
                      <TableCell>Training</TableCell>
                      <TableCell>5.2 MB</TableCell>
                      <TableCell>1,800</TableCell>
                      <TableCell>2024-04-15</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
