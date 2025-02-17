
import { google } from "@ai-sdk/google";
import { simulateReadableStream, streamText } from "ai";

// import { MockLanguageModelV1 } from "ai/test";




// const dummyModel = new MockLanguageModelV1({
//   doStream: async () => ({

//     stream: simulateReadableStream({
//       chunks: [
//         { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
//         { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
//         { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
//         { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
//         { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
//         { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
//         { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
//         { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
//         { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
//         { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
//         { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
//         { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
//         { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
//         { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
//         { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
//         { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
//         { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
//         { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
//         { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
//         { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
//         { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
//         { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
//         { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
//         { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },

//         { type: 'text-delta', textDelta: 'stop 1' },
//         { type: 'text-delta', textDelta: 'stop 2' },
//         { type: 'text-delta', textDelta: 'stop 3' },

//         {
//           type: 'finish',
//           finishReason: 'stop',
//           logprobs: undefined,
//           usage: { completionTokens: 10, promptTokens: 3 },
//         },
//       ],
//       initialDelayInMs: 100,
//       chunkDelayInMs: 120,

//     }),


//     rawCall: { rawPrompt: 'prompt', rawSettings: {} },
//   }),
// });


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    // model: dummyModel,
    abortSignal: req.signal,
    system:
      "do not respond on markdown or lists, keep your responses brief, you can ask the user to upload images or documents if it could help you understand the problem better",
    messages,
    onFinish({ finishReason, response }) {
      console.log('finishReason', finishReason)
      console.log('response', response.messages[response.messages.length - 1].content)
    }
  });

  return result.toDataStreamResponse();
}
