// Trechos baseados na documentação oficial: https://ai-sdk.dev/docs/getting-started/expo

export const ROUTE_BASIC = `
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}`;

export const STREAMTEXT_CALL = `
const result = streamText({
  // Qual modelo usar (via Vercel AI Gateway)
  model: 'anthropic/claude-sonnet-5.5',

  // Histórico da conversa, no formato do modelo
  messages: await convertToModelMessages(messages),
});

// result.stream → pedaços da resposta`;

export const RESPONSE_PART = `
return createUIMessageStreamResponse({
  stream: toUIMessageStream({ stream: result.stream }),
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'none',
  },
});`;

export const ROUTE_SETTINGS = `
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    messages: await convertToModelMessages(messages),

    maxOutputTokens: 500,   // limite de tokens de saída
    temperature: 0.7,       // aleatoriedade da geração
    maxRetries: 2,          // novas tentativas (padrão: 2)
    timeout: {
      totalMs: 30_000,      // operação inteira
      stepMs: 15_000,       // cada etapa
      chunkMs: 10_000,      // intervalo entre pedaços
    },
  });

  return createUIMessageStreamResponse({ /* igual ao anterior */ });
}`;

export const ENV = `
# exemplo fictício — nunca publique a chave real
AI_GATEWAY_API_KEY=sua_chave_aqui`;

export const PROVIDER = `
// 1) String: usa o provider global padrão (Vercel AI Gateway)
model: 'anthropic/claude-sonnet-5.5'

// 2) Importando o gateway explicitamente do pacote 'ai'
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-5.5')

// 3) Outro provider: instale o pacote dele
//    pnpm add @ai-sdk/openai
import { openai } from '@ai-sdk/openai';
model: openai('nome-do-modelo')`;

export const USECHAT = `
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');

  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;
  // ...renderização (próximos slides)
}`;

export const SEND = `
<TextInput
  placeholder="Say something..."
  value={input}
  onChange={e => setInput(e.nativeEvent.text)}
  onSubmitEditing={e => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  }}
  autoFocus={true}
/>`;

export const PARTS = `
{messages.map(m => (
  <View key={m.id} style={{ marginVertical: 8 }}>
    <Text style={{ fontWeight: 700 }}>{m.role}</Text>
    {m.parts.map((part, i) => {
      switch (part.type) {
        case 'text':
          return <Text key={\`\${m.id}-\${i}\`}>{part.text}</Text>;
      }
    })}
  </View>
))}`;

export const API_URL = `
import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const origin = Constants.experienceUrl.replace('exp://', 'http://');
  const path = relativePath.startsWith('/') ? relativePath : \`/\${relativePath}\`;

  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};`;

export const TOOL_DEF = `
import { tool } from 'ai';
import { z } from 'zod';

weather: tool({
  description: 'Get the weather in a location (fahrenheit)',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => {
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    return { location, temperature };
  },
}),`;

export const ROUTE_TOOLS = `
const result = streamText({
  model: 'anthropic/claude-sonnet-5.5',
  messages: await convertToModelMessages(messages),
  tools: {
    weather: tool({ /* definição do slide anterior */ }),
  },
});`;

export const UI_TOOLS = `
switch (part.type) {
  case 'text':
    return <Text key={\`\${m.id}-\${i}\`}>{part.text}</Text>;
  case 'tool-weather':
    return (
      <Text key={\`\${m.id}-\${i}\`}>
        {JSON.stringify(part, null, 2)}
      </Text>
    );
}`;

export const MULTISTEP = `
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-5.5',
  messages: await convertToModelMessages(messages),
  stopWhen: isStepCount(5),
  tools: { weather /* , convertFahrenheitToCelsius */ },
});`;
