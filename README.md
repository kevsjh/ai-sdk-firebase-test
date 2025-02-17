# Minimal Reproducible Project - Stream Abort Issue

## Overview

This project demonstrates an issue with aborting chat streams in Express.js when using Google AI API. The abort signal works correctly in Next.js API routes but fails in Express.js when the chat endpoint is not at the root path.

## Issue Description

- Chat stream controller is located at api/v1/chat
- Frontend sends abort signal using the chat's stop button
- Using Vercel AI SDK's stream stopping mechanism
- Current Behavior:

- - Works correctly in Next.js API
- - In Express.js: Frontend stream stops, but backend continues processing
- - Refer to the onFinish logging to identify if the stream is actually stopped

# Prerequisites

1. Google AI API Setup

Get a free API key from Google AI Studio (Takes ~1 minute)

2. Firebase Setup

Install Firebase Tools:
`npm install -g firebase-tools`

Project ID Requirements:

Either initialize a test Firebase project
OR request an invitation to the test project

3. Install Dependencies
   `npm install`
   Running the Project
4. Start Firebase Emulator
   `cd /firebase`
   `firebase emulators:start`
   This will start both Firebase Functions and Firestore emulators.
5. Review the Code

Examine the Firebase function codebase to understand the implementation
Key focus: Chat stream controller in api/v1/chat

## Project Objective

Fix the abort signal functionality in Express.js without modifying the pathname (api/v1/chat). The solution should ensure that when the frontend sends an abort signal, the backend streams actually stop processing.
Additional Resources

## Vercel AI SDK - Stopping Streams Documentation
