'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider'; // Assuming you have a Slider component
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Button } from '@/components/ui/button'; // Assuming Button component
import { cn } from '@/lib/utils';
import { Cpu, Zap, Cog } from 'lucide-react'; // Example icons

export interface InstanceTypeOption {
  id: InstanceTypeId;
  name: string;
  cpuCores?: number;
  ramGb?: number;
  gpuType?: string;
  gpuCount?: number;
  storageGb?: number;
  costPerHour?: number; // Added for cost calculation
  category: 'CPU Optimized' | 'Memory Optimized' | 'General Purpose' | 'GPU Accelerated';
  description: string;
  icon: React.ElementType;
}

export const instanceTypeOptions: InstanceTypeOption[] = [
  {
    id: 'cpu-optimized',
    name: 'CPU Optimized',
    description: 'For compute-intensive workloads.',
    icon: Cog,
    cpuCores: 8,
    ramGb: 16,
    category: 'CPU Optimized',
  },
  {
    id: 'general-purpose',
    name: 'General Purpose',
    description: 'Balanced CPU, memory, and networking.',
    icon: Cpu,
    cpuCores: 4,
    ramGb: 16,
    category: 'General Purpose',
  },
  {
    id: 'gpu-nvidia-t4',
    name: 'NVIDIA T4',
    description: 'Cost-effective ML inference & graphics.',
    icon: Zap,
    gpuType: 'NVIDIA T4',
    gpuCount: 1,
    cpuCores: 4,
    ramGb: 16,
    category: 'GPU Accelerated',
  },
  {
    id: 'gpu-nvidia-a10g',
    name: 'NVIDIA A10G',
    description: 'Versatile for ML, graphics, HPC.',
    icon: Zap,
    gpuType: 'NVIDIA A10G',
    gpuCount: 1,
    cpuCores: 12,
    ramGb: 48, // A10G typically comes with more RAM
    category: 'GPU Accelerated',
  },
  {
    id: 'gpu-nvidia-a100',
    name: 'NVIDIA A100',
    description: 'Highest performance for ML & HPC.',
    icon: Zap,
    gpuType: 'NVIDIA A100 40GB',
    gpuCount: 1,
    cpuCores: 12,
    ramGb: 96, // A100 typically comes with more RAM
    category: 'GPU Accelerated',
  },
];

// Define an array of the IDs
const validInstanceTypeIds = [
  'cpu-optimized',
  'general-purpose',
  'gpu-nvidia-t4',
  'gpu-nvidia-a10g',
  'gpu-nvidia-a100',
] as const; // Assert this array as a tuple of string literals

// Create a union type of all possible instanceType IDs from the asserted array
export type InstanceTypeId = typeof validInstanceTypeIds[number];

interface HardwareConfigurationSelectorProps {
  memoryAllocation: number;
  onMemoryChange: (value: number) => void;
  instanceType: InstanceTypeId;
  onInstanceTypeChange: (id: InstanceTypeId) => void;
  // dedicatedInstance: boolean; // Add if needed
  // onDedicatedInstanceChange: (value: boolean) => void; // Add if needed
}

export default function HardwareConfigurationSelector({
  memoryAllocation,
  onMemoryChange,
  instanceType,
  onInstanceTypeChange,
}: HardwareConfigurationSelectorProps) {
  const handleSliderChange = (value: number[]) => {
    onMemoryChange(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) { // Basic validation, adjust as needed
      onMemoryChange(val);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <label htmlFor="memoryAllocation" className="block text-sm font-medium text-gray-300 mb-2">
          Memory Allocation (GB)
        </label>
        <div className="flex items-center space-x-4">
          <Slider
            id="memoryAllocation"
            min={1} // Adjust min/max based on typical/allowed values
            max={128} // Example max
            step={1}
            value={[memoryAllocation]}
            onValueChange={handleSliderChange}
            className="w-2/3"
          />
          <Input
            type="number"
            value={memoryAllocation}
            onChange={handleInputChange}
            min={1}
            max={128}
            className="w-1/3 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Instance Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instanceTypeOptions.map((option) => {
            const isSelected = instanceType === option.id;
            return (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => onInstanceTypeChange(option.id)}
                className={cn(
                  'p-4 h-auto flex flex-col items-start text-left justify-start space-y-1',
                  'bg-gray-750 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200',
                  isSelected && 'bg-blue-600 border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-850 text-white hover:bg-blue-600'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <option.icon size={20} className={cn(isSelected ? 'text-white' : 'text-blue-400')} />
                  {/* {isSelected && <CheckCircle size={16} className="text-white" />} */}
                </div>
                <h4 className={cn('font-semibold', isSelected ? 'text-white' : 'text-gray-100')}>{option.name}</h4>
                <p className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-400')}>{option.description}</p>
                {option.gpuType && <p className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-400')}>{option.gpuCount}x {option.gpuType}</p>}
                {option.cpuCores && <p className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-400')}>{option.cpuCores} vCPUs, {option.ramGb} GB RAM</p>}
              </Button>
            );
          })}
        </div>
      </div>
      {/* Placeholder for Dedicated Instance Toggle if needed */}
      {/* <div>
        <label htmlFor="dedicatedInstance" className="flex items-center text-sm font-medium text-gray-300">
          <input
            type="checkbox"
            id="dedicatedInstance"
            name="dedicatedInstance"
            checked={dedicatedInstance}
            onChange={(e) => onDedicatedInstanceChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 mr-2 bg-gray-700"
          />
          Enable Dedicated Instance (Higher Cost, Guaranteed Capacity)
        </label>
      </div> */}
    </div>
  );
}
