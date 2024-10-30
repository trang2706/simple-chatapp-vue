import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "./messagesCollection";

async function insertMessage(text) {
	check(text, String);
	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}
	return await MessagesCollection.insertAsync({
		text,
		userId: Meteor.userId(),
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

Meteor.methods({ insertMessage, removeMessage });
