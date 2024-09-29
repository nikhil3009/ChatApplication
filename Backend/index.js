/** @format */
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectToMongoose from './db/connectToMongoDB.js';
import { addMsgToConversation } from './controllers/msgs.controller.js';
import msgsRouter from './routes/msgs.route.js';

dotenv.config();

const PORT = process.env.PORT || 3030;
const app = express();

// Configure CORS middleware to allow all origins
app.use(
	cors({
		origin: '*', // Allow requests from any origin
		credentials: true, // Allow cookies to be sent with the requests if needed
	})
);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // Allow Socket.IO connections from any origin
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

const userSocketMap = {};

io.on('connection', (socket) => {
	console.log('client is connected');
	console.log('Handshake query:', socket.handshake.query);
	const username = socket.handshake.query.username;
	console.log('one-one', username);
	userSocketMap[username] = socket;

	socket.on('chat msg', (msg) => {
		console.log(msg.sender);
		console.log(msg.receiver);
		console.log(msg.textMsg);
		console.log('received msg:' + JSON.stringify(msg));
		const receiverSocket = userSocketMap[msg.receiver];
		if (receiverSocket) {
			receiverSocket.emit('chat msg', msg);
		}
		addMsgToConversation([msg.sender, msg.receiver], {
			text: msg.textMsg,
			sender: msg.sender,
			receiver: msg.receiver,
		});
	});
});

app.use('/msgs', msgsRouter);

app.get('/', (req, res) => {
	res.send('Hello, World!');
});

server.listen(PORT, () => {
	connectToMongoose();
	console.log(`Server is running on port ${PORT}`);
});
