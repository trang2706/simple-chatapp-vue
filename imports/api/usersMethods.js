import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

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

Meteor.methods({ insertUser, getUsername });
