export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
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
    name: 'AnotherTest Model',
    description: 'A test model configuration',
  },
  {
    id: 'custom-llama2',
    name: 'Llama 2 (Custom)',
    description: 'Meta Llama 2 on Radium Cloud',
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
