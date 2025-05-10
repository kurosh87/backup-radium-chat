import { create } from 'zustand';
import { chatModels } from '@/lib/ai/models';

interface ModelStore {
  models: typeof chatModels;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: chatModels,
  selectedModelId: chatModels[0]?.id || 'unknown',
  setSelectedModelId: (id: string) => set({ selectedModelId: id }),
}));
