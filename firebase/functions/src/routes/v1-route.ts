import { chatRoute } from "./chat-route";

const express = require('express');

const router = express.Router();

router.use('/chat', chatRoute)

export { router as v1Route }