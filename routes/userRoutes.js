import express from 'express';

const router = express.Router();

import {signup,login,assignTicket} from '../controllers/user.js'

router.post('/signup', signup);

router.post('/login', login);

router.post('/assignTicket',assignTicket);

export default router;