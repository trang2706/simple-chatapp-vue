import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "./messagesCollection";

Meteor.publish("messages", function publishMessages() {
	return MessagesCollection.find();
});
