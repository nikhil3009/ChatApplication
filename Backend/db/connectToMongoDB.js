/** @format */

import mongoose from 'mongoose';
const connectToMongoose = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('db connected!');
	} catch (error) {
		console.log('failed to connect db');
	}
};
export default connectToMongoose;
