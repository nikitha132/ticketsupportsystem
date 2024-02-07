import express from 'express';

const router = express.Router();

import { createTicket, getTicket } from '../controllers/ticket.js'

router.post('/createTicket/:userId', createTicket);

router.get('/getTicket/:userId', getTicket);



export default router;
