
import { pipeDataStreamToResponse, simulateReadableStream, streamText } from 'ai';
import { error } from 'firebase-functions/logger';
import { Request, Response, NextFunction, } from 'express';
import { google } from '@ai-sdk/google';
import { firebaseFirestore } from '../config/firebase-init';
import { FieldValue } from 'firebase-admin/firestore';
import { convertArrayToReadableStream, MockLanguageModelV1 } from 'ai/test';





const dummyModel = new MockLanguageModelV1({
    doStream: async () => ({

        stream: simulateReadableStream({
            chunks: [
                { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
                { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
                { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
                { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
                { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
                { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
                { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
                { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
                { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
                { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
                { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
                { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
                { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
                { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
                { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
                { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
                { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
                { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },
                { type: 'text-delta', textDelta: 'Generate code snippets: Need a specific component, API route, or page structure? Just ask!' },
                { type: 'text-delta', textDelta: 'Explain concepts: Confused about getServerSideProps, getStaticProps, or the app directory? I can break them down.' },
                { type: 'text-delta', textDelta: 'Debug code: Having trouble with an error? Paste the code and error message, and I try to help you find the problem.' },
                { type: 'text-delta', textDelta: 'Optimize performance: Need to speed up your app? I can suggest improvements for your code.' },
                { type: 'text-delta', textDelta: 'Generate documentation: Need to create documentation for your project? I can help you write it.' },
                { type: 'text-delta', textDelta: 'Generate tests: Need to create tests for your project? I can help you write them.' },

                { type: 'text-delta', textDelta: 'stop 1' },
                { type: 'text-delta', textDelta: 'stop 2' },
                { type: 'text-delta', textDelta: 'stop 3' },

                {
                    type: 'finish',
                    finishReason: 'stop',
                    logprobs: undefined,
                    usage: { completionTokens: 10, promptTokens: 3 },
                },
            ],
            initialDelayInMs: 100,
            chunkDelayInMs: 120,

        }),


        rawCall: { rawPrompt: 'prompt', rawSettings: {} },
    }),
});

// use dummy chat id
const chatId = 'xx123456'
export const invokeChat = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const { messages } = req.body

        const abortController = new AbortController();
        const signal = abortController.signal;


        req.on('close', () => {
            console.log('request closed')
            abortController.abort();
        });

        return pipeDataStreamToResponse(res, {
            onError: (err: unknown) => {
                error(`Error in pipeDataStreamToResponse: ${err}`)
                return 'Something went wrong. Please try again later.'
            },
            execute(writer) {
                const stream = streamText({

                    // use a real model to test as well
                    // model: google('gemini-2.0-flash-001'),
                    model: dummyModel,
                    system: 'You are a helpful assistant that can answer questions and help with tasks.',
                    messages,
                    abortSignal: signal,
                    onFinish({ finishReason, response }) {
                        // print last message content
                        console.log('response', response.messages[response.messages.length - 1].content)

                        if (finishReason === 'stop') {
                            const responseMessages = response.messages;
                            let chatRef = firebaseFirestore.collection("chats").doc(chatId)
                            chatRef.set({
                                userMessage: messages[messages.length - 1].content,
                                assistantMessage: responseMessages[responseMessages.length - 1].content,
                                createdAt: FieldValue.serverTimestamp()
                            })
                        }

                    }
                })
                stream.mergeIntoDataStream(writer, {
                    sendReasoning: true,
                });
            },
        })
    } catch (err) {

        return res.status(500).json({
            message: 'Internal server error',
            error: err
        })

    }
}