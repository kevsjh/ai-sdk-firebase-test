import { onRequest } from "firebase-functions/v2/https";
import mainApp from "./express/main-app";
import { pipeDataStreamToResponse, simulateReadableStream, streamText } from "ai";
import { error } from "firebase-functions/logger";
import { MockLanguageModelV1 } from "ai/test";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



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

exports.api = onRequest({
    region: 'us-central1',
    cors: true,

    minInstances: 0,
    maxInstances: 100,
    // timeout within 3 minutes
    timeoutSeconds: 180,
    concurrency: 30,
    memory: '1GiB',
}, (req, res) => {

    // return mainApp(req, res)

    const { messages } = req.body

    const controller = new AbortController();
    const abortSignal = controller.signal;

    // on close
    req.on('close', () => {
        console.log('request closed')
        controller.abort()
    })

    req.on('end', () => {
        console.log('request end')
        controller.abort()
    })

    req.on('aborted', () => {
        console.log('Request aborted (middleware)');
        controller.abort()
    });

    req.on('pause', () => {
        console.log('Request paused (middleware)');
        controller.abort()
    });


    res.on('close', () => {
        console.log('response closed')

    })
    res.on('finish', () => {
        console.log('response finish')
    })
    res.on('error', (err) => {
        console.log('response error', err)
    })



    req.on('error', (err) => {
        console.log('request error', err)
    })

    req.on('finish', () => {
        console.log('request finish')
        controller.abort()
    })


    req.on('data', () => {
        console.log('request data')
    })
    req.on('readable', () => {
        console.log('request readable')
    })


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
                abortSignal: abortSignal,
                onFinish({ finishReason, response }) {
                    console.log('on finish', finishReason)
                    // print last message content

                    if (abortSignal.aborted) {
                        console.log('request aborted')
                        return
                    }

                    console.log('response', response.messages[response.messages.length - 1].content)

                    if (finishReason === 'stop') {
                        const responseMessages = response.messages;
                        // let chatRef = firebaseFirestore.collection("chats").doc(chatId)
                        // chatRef.set({
                        //     userMessage: messages[messages.length - 1].content,
                        //     assistantMessage: responseMessages[responseMessages.length - 1].content,
                        //     createdAt: FieldValue.serverTimestamp()
                        // })
                    }

                }
            })
            stream.mergeIntoDataStream(writer, {
                sendReasoning: true,
            });
        },
    })
});
