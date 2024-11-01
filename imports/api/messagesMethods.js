import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "./messagesCollection";

async function insertMessage({ text, receiverId }) {
	check(text, String);

	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	return await MessagesCollection.insertAsync({
		text,
		senderId: Meteor.userId(),
		receiverId: receiverId,
		createdAt: new Date(),
	});
}

async function removeMessage(messageId) {
	check(messageId, String);

	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}
	await MessagesCollection.removeAsync(messageId);
}

/**
 * Get messages
 *
 * @param {*} param0
 * @returns
 */
async function getMessages({ senderId, receiverId }) {
	check(senderId, String);
	check(receiverId, String);

	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	try {
		return await MessagesCollection.find(
			{
				$or: [
					{ senderId: Meteor.userId() },
					{ receiverId: Meteor.userId() },
				],
			},
			{ sort: { createdAt: 1 } }
		).fetch(); // Use .fetch() to get an array from the cursor
	} catch (error) {
		console.error(error);
	}
}

/**
 * Get last message of user
 * @param {*} userId
 * @returns
 */
async function getLastMessage(userId) {
	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	try {
		return await MessagesCollection.findOneAsync(
			{ $or: [{ senderId: userId }, { receiverId: userId }] },
			{ sort: { createdAt: -1 } } // Sort by creation date in descending order
		);
	} catch (error) {
		console.error(error);
	}
}

Meteor.methods({
	insertMessage,
	removeMessage,
	getLastMessage,
	getMessages,
});
