/** @format */
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import usersRouter from './routes/user.route.js';
import connectToMongoose from './db/mongoDbConnection.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'http://localhost:3002',
		],
	})
);

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
	res.send('Hello, World! from auth');
});

app.listen(PORT, () => {
	connectToMongoose();
	console.log(`Server is running on port ${PORT}`);
});
