import { Meteor } from "meteor/meteor";

Meteor.publish("allUsers", async function () {
	return await Meteor.users.find({});
});
