import express from "express";
import { askChatbot } from "../controllers/chatbot.controller.js";
import { verifyToken } from "../guards/verifyToken.js";

const router = express.Router();
router.post("/ask", verifyToken, askChatbot);

export default router;
