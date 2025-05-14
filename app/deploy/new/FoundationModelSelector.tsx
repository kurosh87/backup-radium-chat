'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import { CheckCircle, Info } from 'lucide-react';

export interface FoundationModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tags: string[];
  params: string;
  contextTokens: string; // e.g., "530.0k"
  outputTokens: string; // e.g., "65.0k"
  recommended?: boolean;
  estimatedCostPerHour?: number; // Added for cost calculation
}

interface FoundationModelSelectorProps {
  models: FoundationModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

const ModelCard: React.FC<{
  model: FoundationModel;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ model, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative group text-left p-4 border rounded-lg transition-all duration-150 ease-in-out w-full h-full flex flex-col justify-between',
        'bg-gray-750 border-gray-600 hover:bg-gray-700 hover:border-gray-500',
        isSelected && 'bg-blue-600 border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-850 text-white'
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className={cn('text-lg font-semibold', isSelected ? 'text-white' : 'text-gray-100')}>{model.name}</h3>
          {model.recommended && !isSelected && (
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Recommended</span>
          )}
          {isSelected && <CheckCircle size={20} className="text-white" />}
        </div>
        <p className={cn('text-xs mb-1', isSelected ? 'text-blue-100' : 'text-gray-400')}>{model.provider}</p>
        <p className={cn('text-sm mb-3', isSelected ? 'text-blue-50' : 'text-gray-300')}>{model.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {model.tags.map(tag => (
            <span key={tag} className={cn('text-xs px-2 py-0.5 rounded-full',
              isSelected ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
            )}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={cn('text-xs border-t pt-2 mt-auto', isSelected ? 'border-blue-400' : 'border-gray-600')}>
        <div className="flex justify-between items-center">
          <span className={isSelected ? 'text-blue-100' : 'text-gray-400'}>{model.params}</span>
          <Info size={14} className={cn('cursor-pointer', isSelected ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-gray-300')} />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-400')}>Input: {model.contextTokens}</span>
          <span className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-400')}>Output: {model.outputTokens}</span>
        </div>
      </div>
    </button>
  );
};

export default function FoundationModelSelector({
  models,
  selectedModelId,
  onSelectModel,
}: FoundationModelSelectorProps) {
  // For now, just the Foundation Models tab content
  return (
    <div className="py-4">
      <p className="text-sm text-gray-400 mb-4">
        Your model is pre-selected for your convenience. You can proceed with deployment or choose a different foundation model below.
      </p>
      {/* Tab structure placeholder - to be implemented if needed */}
      {/* <div className="mb-4 border-b border-gray-700">
        <button className="px-4 py-2 text-sm font-medium text-blue-400 border-b-2 border-blue-400">Foundation Models</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200">Model Catalog</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200">Custom Models</button>
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={model.id === selectedModelId}
            onSelect={() => onSelectModel(model.id)}
          />
        ))}
      </div>
    </div>
  );
}
