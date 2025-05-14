'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Assuming RadioGroup
import { Slider } from '@/components/ui/slider';

interface ScalingConfigurationSelectorProps {
  minInstances: number;
  onMinInstancesChange: (value: number) => void;
  maxInstances: number;
  onMaxInstancesChange: (value: number) => void;
  enableAutoscaling: boolean;
  onEnableAutoscalingChange: (enabled: boolean) => void;
  autoscalingTrigger: 'cpu' | 'gpu' | 'custom'; // Example triggers
  onAutoscalingTriggerChange: (trigger: 'cpu' | 'gpu' | 'custom') => void;
  autoscalingTarget: number; // Percentage or value
  onAutoscalingTargetChange: (value: number) => void;
}

export default function ScalingConfigurationSelector({
  minInstances,
  onMinInstancesChange,
  maxInstances,
  onMaxInstancesChange,
  enableAutoscaling,
  onEnableAutoscalingChange,
  autoscalingTrigger,
  onAutoscalingTriggerChange,
  autoscalingTarget,
  onAutoscalingTargetChange,
}: ScalingConfigurationSelectorProps) {

  const handleMinMaxChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) { // Basic validation
      setter(val);
    }
  };

  const handleTargetSliderChange = (value: number[]) => {
    onAutoscalingTargetChange(value[0]);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="minInstances" className="text-sm font-medium text-gray-300">Minimum Replicas</Label>
          <Input
            id="minInstances"
            type="number"
            value={minInstances}
            onChange={(e) => handleMinMaxChange(e, onMinInstancesChange)}
            min={0} // Or 1 if that's the minimum allowed
            className="mt-1 bg-gray-700 border-gray-600 text-white"
          />
          <p className="mt-1 text-xs text-gray-400">Minimum number of active model instances.</p>
        </div>
        <div>
          <Label htmlFor="maxInstances" className="text-sm font-medium text-gray-300">Maximum Replicas</Label>
          <Input
            id="maxInstances"
            type="number"
            value={maxInstances}
            onChange={(e) => handleMinMaxChange(e, onMaxInstancesChange)}
            min={minInstances} // Max should be >= Min
            className="mt-1 bg-gray-700 border-gray-600 text-white"
          />
          <p className="mt-1 text-xs text-gray-400">Maximum number of instances for autoscaling.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
        <Switch
          id="enableAutoscaling"
          checked={enableAutoscaling}
          onCheckedChange={onEnableAutoscalingChange}
        />
        <Label htmlFor="enableAutoscaling" className="text-sm font-medium text-gray-300">Enable Autoscaling</Label>
      </div>

      {enableAutoscaling && (
        <div className="space-y-6 pl-2 border-l-2 border-blue-500 ml-2">
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Autoscaling Trigger</Label>
            <RadioGroup
              value={autoscalingTrigger}
              onValueChange={(value: 'cpu' | 'gpu' | 'custom') => onAutoscalingTriggerChange(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cpu" id="cpu-trigger" className="border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                <Label htmlFor="cpu-trigger" className="text-gray-300">CPU Utilization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gpu" id="gpu-trigger" className="border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                <Label htmlFor="gpu-trigger" className="text-gray-300">GPU Utilization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom-trigger" className="border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                <Label htmlFor="custom-trigger" className="text-gray-300">Custom Metric</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="autoscalingTarget" className="text-sm font-medium text-gray-300">
              Target Utilization (%)
            </Label>
            <div className="flex items-center space-x-4 mt-1">
              <Slider
                id="autoscalingTargetSlider"
                min={10} 
                max={90} 
                step={5}
                value={[autoscalingTarget]}
                onValueChange={handleTargetSliderChange}
                className="w-2/3"
                disabled={autoscalingTrigger === 'custom'}
              />
              <Input
                id="autoscalingTargetInput"
                type="number"
                value={autoscalingTarget}
                onChange={(e) => handleMinMaxChange(e, onAutoscalingTargetChange)}
                min={10}
                max={90}
                className="w-1/3 bg-gray-700 border-gray-600 text-white"
                disabled={autoscalingTrigger === 'custom'}
              />
            </div>
            {autoscalingTrigger === 'custom' && (
                 <p className="mt-2 text-xs text-gray-400">Custom metric scaling configuration will be handled via advanced settings or API.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
