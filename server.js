import express from 'express';
import http from 'http';

import routes from './routes/index.js'
import connectDb from './config/dbConnection.js';
import cors from 'cors'
import initializeSocket from './services/socket.js';
const app = express();


app.use(express.json())

const server = http.createServer(app);


const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

const port = 8000;

connectDb();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', routes)

initializeSocket(server);

server.listen(port, () => {
    console.log('Started server');
});

//Run app, then load http://localhost:port in a browser to see the output.