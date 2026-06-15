import express from "express";
import {
  sendMessage,
  getMessages,
  deleteChat,
  deleteMessage,
  likeMessage
} from "../controllers/messagerouteController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/send/:id", isLogin, sendMessage);
router.get("/:id", isLogin, getMessages);
router.delete("/:id", isLogin, deleteChat);
router.delete("/single/:messageId", isLogin, deleteMessage);
router.post("/like/:messageId", isLogin, likeMessage);

export default router;
