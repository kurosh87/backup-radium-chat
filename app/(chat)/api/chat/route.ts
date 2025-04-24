import {
  type UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI, type OpenAIProvider } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { deepinfra } from '@ai-sdk/deepinfra';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';

// Define a type for the combined provider possibilities
type CombinedProvider = OpenAIProvider | typeof myProvider | ReturnType<typeof fireworks> | ReturnType<typeof deepinfra>;

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Forbidden', { status: 403 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    let provider: CombinedProvider;
    let modelIdToUse: string; // Variable to hold the final model ID

    // Check if the selected model is the custom Llama 2
    if (selectedChatModel === 'custom-llama2') {
      console.log('>>> Using custom OpenAI provider for Llama 2'); // Logging for clarity
      const baseURL = process.env.CUSTOM_LLM_BASE_URL;
      const apiKey = process.env.CUSTOM_LLM_API_KEY;
      const customModelId = process.env.CUSTOM_LLM_MODEL_ID ?? ''; // Get the specific model ID from env

      if (!baseURL || !customModelId) {
        console.error("Custom Llama 2 environment variables not set properly.");
        return new Response('Custom Llama 2 configuration error', { status: 500 });
      }

      console.log(`>>>   Base URL: ${baseURL}`);
      console.log(`>>>   Model ID: ${customModelId}`);
      console.log(`>>>   API Key: ${apiKey ? 'provided' : 'not provided (using "empty")'}`);

      // Create a specific OpenAI provider instance for the custom endpoint
      provider = createOpenAI({
        baseURL: baseURL,
        apiKey: apiKey, // Will use 'empty' if CUSTOM_LLM_API_KEY is set to "empty"
        compatibility: 'compatible', // Important for non-OpenAI endpoints
      });
      modelIdToUse = customModelId; // Use the specific model ID from env
    } else if (selectedChatModel === 'gpt-4.5-preview') { // Keep existing logic for other models
      console.log('>>> Using default OpenAI provider for gpt-4.5-preview');
      provider = createOpenAI({
        // API key is implicitly read from OPENAI_API_KEY env var
      });
      modelIdToUse = selectedChatModel;
    } else if (selectedChatModel === 'fireworks-deepseek-r1') { // Add condition for Fireworks Deepseek
      console.log('>>> Using Fireworks provider for Deepseek R1');
      // Fireworks provider reads FIREWORKS_API_KEY from env automatically
      provider = fireworks; // Set the provider
      modelIdToUse = 'accounts/fireworks/models/deepseek-r1'; // Set the model ID
    } else if (selectedChatModel === 'deepinfra-llama4-maverick') {
      console.log('>>> Using DeepInfra provider for Llama 4 Maverick');
      // DeepInfra provider reads DEEPINFRA_API_TOKEN from env automatically
      provider = deepinfra;
      modelIdToUse = 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'; // Set the specific model path
    } else {
      console.log(`>>> Using myProvider for model: ${selectedChatModel}`);
      provider = myProvider; // Use the default provider from @/lib/ai/providers
      modelIdToUse = selectedChatModel;
    }

    // Get the base language model instance
    const baseModel = provider.languageModel(modelIdToUse as any);

    // Conditionally wrap the model if it's Fireworks Deepseek R1 for reasoning
    let finalModelToUse = baseModel;
    if (selectedChatModel === 'fireworks-deepseek-r1') {
      console.log('>>> Wrapping Fireworks model with reasoning middleware');
      finalModelToUse = wrapLanguageModel({
        model: baseModel, // Wrap the base fireworks model
        middleware: extractReasoningMiddleware({ tagName: 'think' }), // Extract <think> tags
      });
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: finalModelToUse, // Use the final (potentially wrapped) model
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning' || 
            selectedChatModel === 'custom-llama2' || 
            selectedChatModel === 'fireworks-deepseek-r1' ||
            selectedChatModel === 'deepinfra-llama4-maverick'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
            metadata: { // Add model info to telemetry if needed
              model: modelIdToUse
            }
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('[API Chat Stream Error]', error);
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
