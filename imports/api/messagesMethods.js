import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "./messagesCollection";

async function insertMessage({ text, receiverId }) {
	check(text, String);

	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	try {
		return await MessagesCollection.insertAsync({
			text,
			senderId: Meteor.userId(),
			receiverId: receiverId,
			createdAt: new Date(),
		});
	} catch (error) {
		console.error(error);
	}
}

async function removeMessage(messageId) {
	check(messageId, String);

	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}
	await MessagesCollection.removeAsync(messageId);
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

/**
 * Get all messages by Id
 *
 * @param {*} userId
 * @returns
 */
function getMessagesById(userId) {
	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	try {
		return MessagesCollection.find(
			{
				$or: [{ senderId: userId }, { receiverId: userId }],
			},
			{ sort: { createdAt: -1 } }
		).fetch();
	} catch (error) {
		console.error(error);
	}
}

Meteor.methods({
	insertMessage,
	removeMessage,
	getLastMessage,
	getMessagesById,
});
