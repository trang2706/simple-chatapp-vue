import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "./messagesCollection";

Meteor.publish("messages", function publishUsers() {
	return MessagesCollection.find();
});
