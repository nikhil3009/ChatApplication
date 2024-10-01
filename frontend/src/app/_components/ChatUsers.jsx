/** @format */

import React, { useEffect } from 'react';
import { useUserStore } from '../zustand/useUserStore';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import axios from 'axios';

const ChatUsers = () => {
	const { users } = useUserStore();
	const { authName } = useAuthStore();
	const { updateChatMsgs } = useChatMsgsStore();
	const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
	const setChatReceiver = (user) => {
		updateChatReceiver(user.username);
	};
	useEffect(() => {
		const getMsgs = async () => {
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_BE_HOST}:3030/msgs`,
				{
					params: {
						sender: authName,
						receiver: chatReceiver,
					},
				},
				{
					withCredentials: true,
				}
			);
			if (res.data.length !== 0) {
				updateChatMsgs(res.data);
			} else {
				updateChatMsgs([]);
			}
		};
		if (chatReceiver) {
			getMsgs();
		}
	}, [chatReceiver]);

	return (
		<div>
			{users.map((user, index) => (
				<div
					onClick={() => setChatReceiver(user)}
					className='bg-purple-200 rounded-xl m-3 p-5 cursor-pointer'>
					{user.username}
				</div>
			))}
		</div>
	);
};

export default ChatUsers;
