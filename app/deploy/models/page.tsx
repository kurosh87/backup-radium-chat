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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useModelStore } from '@/hooks/use-model-store';
import {
  ServerIcon,
  RocketIcon,
  ZapIcon,
  ChevronsUpDown,
  ChevronDown,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample model data
const models = [
  {
    id: 'llama-2-7b',
    name: 'Llama 2 7B Chat',
    type: 'chat',
    author: 'Meta',
    parameters: '7B',
    context: '4K',
    pricing: '$0.20 / $0.60',
    status: 'Available',
  },
  {
    id: 'llama-2-13b',
    name: 'Llama 2 13B Chat',
    type: 'chat',
    author: 'Meta',
    parameters: '13B',
    context: '4K',
    pricing: '$0.27 / $0.85',
    status: 'Available',
  },
  {
    id: 'llama-2-70b',
    name: 'Llama 2 70B Chat',
    type: 'chat',
    author: 'Meta',
    parameters: '70B',
    context: '4K',
    pricing: '$1.00 / $1.50',
    status: 'Available',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    type: 'chat',
    author: 'DeepSeek',
    parameters: '8B',
    context: '8K',
    pricing: '$0.90 / $1.80',
    status: 'Available',
  },
  {
    id: 'qwen-32b',
    name: 'Qwen QwQ-32B',
    type: 'chat',
    author: 'Qwen',
    parameters: '32B',
    context: '32K',
    pricing: '$0.90 / $1.40',
    status: 'Available',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral (7B) Instruct v0.2',
    type: 'chat',
    author: 'Mistral AI',
    parameters: '7B',
    context: '8K',
    pricing: '$0.25 / $0.75',
    status: 'Available',
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek R1 Distill Llama 70B',
    type: 'chat',
    author: 'DeepSeek',
    parameters: '70B',
    context: '8K',
    pricing: '$2.00 / $3.00',
    status: 'Available',
  },
  {
    id: 'my-llama-fine-tuned',
    name: 'My Llama Fine-tuned',
    type: 'chat',
    author: 'Custom',
    parameters: '7B',
    context: '4K',
    pricing: 'Custom',
    status: 'Deploying',
  },
];

// Define columns for the table
const columns: ColumnDef<(typeof models)[0]>[] = [
  {
    accessorKey: 'name',
    header: 'Model / Endpoint',
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex items-center gap-2">
          <ServerIcon className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-xs text-muted-foreground">{model.author}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue('type')}</div>;
    },
  },
  {
    accessorKey: 'parameters',
    header: 'Size',
    cell: ({ row }) => {
      return <div>{row.getValue('parameters')}</div>;
    },
  },
  {
    accessorKey: 'context',
    header: 'Context',
    cell: ({ row }) => {
      return <div>{row.getValue('context')}</div>;
    },
  },
  {
    accessorKey: 'pricing',
    header: 'Pricing (per 1M tokens)',
    cell: ({ row }) => {
      return <div>{row.getValue('pricing')}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs inline-block 
          ${
            status === 'Available'
              ? 'bg-green-100 text-green-800'
              : status === 'Deploying'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Deploy Model</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Fine-tune Model</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// Deployed models data
const deployedModels = [
  {
    id: 'my-llama-13b',
    name: 'My Llama 13B',
    author: 'Custom',
    endpoint: 'custom-llama-13b-endpoint',
    deployed: '2024-05-01',
    status: 'Active',
    requests: 12453,
    avgLatency: '150ms',
  },
  {
    id: 'my-deepseek',
    name: 'My DeepSeek',
    author: 'Custom',
    endpoint: 'custom-deepseek-endpoint',
    deployed: '2024-04-15',
    status: 'Active',
    requests: 23876,
    avgLatency: '120ms',
  },
];

// Define columns for deployed models
const deployedColumns: ColumnDef<(typeof deployedModels)[0]>[] = [
  {
    accessorKey: 'name',
    header: 'Model',
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex items-center gap-2">
          <RocketIcon className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-xs text-muted-foreground">{model.author}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'endpoint',
    header: 'Endpoint',
    cell: ({ row }) => {
      return (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          {row.getValue('endpoint')}
        </code>
      );
    },
  },
  {
    accessorKey: 'deployed',
    header: 'Deployed Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs inline-block 
          ${
            status === 'Active'
              ? 'bg-green-100 text-green-800'
              : status === 'Inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: 'requests',
    header: 'Requests',
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {new Intl.NumberFormat().format(Number(row.getValue('requests')))}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgLatency',
    header: 'Avg. Latency',
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue('avgLatency')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Manage</DropdownMenuItem>
              <DropdownMenuItem>View Stats</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function ModelsPage() {
  const { models: storeModels } = useModelStore();
  const defaultModelId = storeModels[0]?.id || 'unknown';

  // State for the tables
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deployedSorting, setDeployedSorting] = useState<SortingState>([]);
  const [deployedColumnFilters, setDeployedColumnFilters] =
    useState<ColumnFiltersState>([]);

  // Tables
  const table = useReactTable({
    data: models,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const deployedTable = useReactTable({
    data: deployedModels,
    columns: deployedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setDeployedSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setDeployedColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: deployedSorting,
      columnFilters: deployedColumnFilters,
    },
  });

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        chatId="deploy-models"
        selectedModelId={defaultModelId}
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <main className="flex-1 overflow-y-auto p-8 max-w-[2000px] mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Model Deployment"
            description="Deploy and manage AI models"
          />
          <Button asChild>
            <Link href="/deploy/new">Deploy New Model</Link>
          </Button>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="mb-8">
            <TabsTrigger value="available">Available Models</TabsTrigger>
            <TabsTrigger value="deployed">My Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={
                    (table.getColumn('name')?.getFilterValue() as string) ?? ''
                  }
                  onChange={(e) =>
                    table.getColumn('name')?.setFilterValue(e.target.value)
                  }
                  className="h-9"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[1000px]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-1">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() && (
                                <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deployed" className="space-y-4">
            {deployedModels.length > 0 ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full max-w-xl">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search deployments..."
                      value={
                        (deployedTable
                          .getColumn('name')
                          ?.getFilterValue() as string) ?? ''
                      }
                      onChange={(e) =>
                        deployedTable
                          .getColumn('name')
                          ?.setFilterValue(e.target.value)
                      }
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {deployedTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : (
                                <div className="flex items-center gap-1">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                  {header.column.getCanSort() && (
                                    <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {deployedTable.getRowModel().rows.length ? (
                        deployedTable.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={deployedColumns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ServerIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="mb-4">
                  You haven&apos;t deployed any models yet.
                </p>
                <Button>Deploy your first model</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
