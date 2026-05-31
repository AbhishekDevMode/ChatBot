import express from 'express';

import {userLogin, userRegsiter ,userLogOut} from '../controllers/userroutController.js';

const router=express.Router();

router.post('/register',userRegsiter);
router.post('/login',userLogin);
router.post('/logout',userLogOut);

export default router;