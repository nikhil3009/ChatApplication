/** @format */

import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import generateJWTandSetCookie from '../utils/generateToken.js';

const signup = async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const userFound = await User.findOne({ username });
		if (userFound) {
			res.status(201).json({ message: 'username already exists' });
		} else {
			const user = new User({ username: username, password: hashedPassword });
			console.log('user', user);
			generateJWTandSetCookie(user._id, res);
			await user.save();
			res.status(201).json({ message: 'username registered successfulyy' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'user registration failed' });
	}
};
export const signin = async (req, res) => {
	try {
		const { username, password } = req.body;

		const userFound = await User.findOne({ username });
		if (!userFound) {
			res.status(401).json({ message: 'Authentication failed' });
		} else {
			const passwordMatch = await bcrypt.compare(password, userFound?.password);
			if (!passwordMatch) {
				res.status(401).json({ message: 'Authentication failed' });
			}
			generateJWTandSetCookie(userFound._id, res);
			res
				.status(201)
				.json({ _id: userFound._id, username: userFound.username });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Login failed' });
	}
};
export default signup;
