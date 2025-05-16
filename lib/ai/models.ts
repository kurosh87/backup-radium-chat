export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider?: string;
  modelName?: string;
  contextLength?: number;
  baseURL?: string;
  apiKey?: {
    value: string;
    envVar: string;
    required: boolean;
  };
  enabled?: boolean;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'custom-llama2',
    name: 'Llama 2 (Custom)',
    description: 'Meta Llama 2 on Radium Cloud',
  },
  // Commenting out other models for now
  /*
  {
    id: 'gpt-4.5-preview',
    name: 'Another Test Model',
    description: 'A test model configuration',
  },
  {
    id: 'deepseek-r1',
    provider: 'custom',
    modelName: '/home/radium/models/deepseek-ai/DeepSeek-R1',
    name: 'DeepSeek R1',
    description: 'DeepSeek R1 model running on local endpoint',
    contextLength: 4096,
    baseURL: 'http://10.100.110.20:8001/v1',
    apiKey: {
      value: 'empty',
      envVar: 'CUSTOM_LLM_API_KEY',
      required: false,
    },
    enabled: true,
  },
  */
];
