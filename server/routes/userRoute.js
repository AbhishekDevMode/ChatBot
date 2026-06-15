import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getCurrentChatters, getUserBySearch, updateProfilePic } from "../controllers/userhandlerController.js";
import upload from "../middleware/upload.js";
const router = express.Router();
router.get('/search', isLogin, getUserBySearch);
router.get('/currentchatters',isLogin,getCurrentChatters);
router.put('/profile-pic', isLogin, upload.single('profilepic'), updateProfilePic);
export default router;
