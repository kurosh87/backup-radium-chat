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
    id: 'gpt-4.5-preview',
    name: 'Another Test Model',
    description: 'A test model configuration',
  },
  {
    id: 'custom-llama2',
    name: 'Llama 2 (Custom)',
    description: 'Meta Llama 2 on Radium Cloud',
  },
  {
    id: 'deepseek-r1',
    provider: 'custom',
    modelName: '/home/radium/models/deepseek-ai/DeepSeek-R1',
    name: 'DeepSeek R1',
    description: 'DeepSeek R1 model running on local endpoint',
    contextLength: 4096, // Assuming a default, adjust if known
    baseURL: 'http://10.100.110.20:8001/v1',
    apiKey: {
      value: 'empty', // Based on 'Authorization: Bearer empty'
      envVar: 'CUSTOM_LLM_API_KEY', // Optional: If we want to control via env
      required: false,
    },
    enabled: true,
  },
  /*
  {
    id: 'fireworks-deepseek-r1',
    name: 'DeepSeek R1 (Fireworks)',
    description: 'Reasoning model via Fireworks AI',
  },
  */
  /*
  {
    id: 'deepinfra-llama4-maverick',
    name: 'Llama 4 Maverick (DeepInfra)',
    description: 'Llama 4 17B Instruct via DeepInfra',
  },
  */
];
