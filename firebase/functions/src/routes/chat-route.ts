import { invokeChat } from "../controllers/chat-controllers";

const express = require('express');
const router = express.Router();

router.post('/', invokeChat)
export { router as chatRoute }