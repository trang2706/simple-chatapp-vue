import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { MessagesCollection } from "./messagesCollection";

/**
 * Create new account
 *
 * @param {*} param0
 * @returns
 */
async function insertUser({ name, email, password }) {
	check(name, String);
	check(email, String);
	check(password, String);

	// Check for existing email
	const existingEmail = await Accounts.findUserByEmail(email);

	if (existingEmail) {
		throw new Meteor.Error("email-exists", "Email already exists.");
	}

	// Create the user
	try {
		const userId = await Accounts.createUserAsync({
			email,
			password,
			profile: {
				name: name,
			},
		});

		return userId;
	} catch (error) {
		throw new Meteor.Error(
			"registration-failed",
			"Registration failed. Please try again."
		);
	}
}

/**
 * Get user
 *
 * @param {*} userId
 * @returns
 */
async function getUser(userId) {
	try {
		const user = await Meteor.users.findOneAsync(userId, {
			fields: { _id: 1, profile: 1 },
		});

		if (user) return user;
	} catch (error) {
		console.error(error);
	}
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
	getUser,
	getUniqueReceivers,
});
