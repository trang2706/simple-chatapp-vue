import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "./messagesCollection";

async function insertUser({ username, password }) {
	check(username, String);
	check(password, String);

	// Check for existing username
	const existingUser = await Accounts.findUserByUsername(username);

	if (existingUser) {
		throw new Meteor.Error(
			"username-exists",
			"This username is already taken. Please choose another."
		);
	}

	// Create the user
	try {
		const userId = Accounts.createUser({ username, password });
		return userId;
	} catch (error) {
		throw new Meteor.Error(
			"registration-failed",
			"Registration failed. Please try again."
		);
	}
}

async function getUsername(userId) {
	const user = await Meteor.users.findOneAsync(userId);

	if (user) return user.username;
}

/**
 * Get users who current user texted
 *
 * @param {*} userId
 * @returns
 */
async function getUniqueReceivers(userId) {
	if (!Meteor.userId()) {
		throw new Meteor.Error("Not authorized.");
	}

	try {
		// Get unique receiver IDs
		const receiverIds = await MessagesCollection.rawCollection().distinct(
			"receiverId",
			{
				senderId: userId,
			}
		);

		// Get unique sender IDs
		const senderIds = await MessagesCollection.rawCollection().distinct(
			"senderId",
			{
				receiverId: userId,
			}
		);

		// Combine both arrays and remove duplicates
		let userIds = receiverIds.concat(senderIds);
		userIds = userIds.filter((id, index) => userIds.indexOf(id) === index);

		// Fetch user information for each receiverId
		const users = Meteor.users
			.find(
				{ _id: { $in: userIds } },
				{ fields: { username: 1, profile: 1, email: 1 } } // Adjust fields as needed
			)
			.fetch();

		return users;
	} catch (error) {
		console.error(error);
	}
}

Meteor.methods({
	insertUser,
	getUsername,
	getUniqueReceivers,
});
