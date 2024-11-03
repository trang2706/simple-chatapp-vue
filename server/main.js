import { Meteor } from "meteor/meteor";
import "../imports/api/messagesPublications";
import "../imports/api/messagesMethods";
import "../imports/api/usersPublications";
import "../imports/api/usersMethods";
import { ServiceConfiguration } from "meteor/service-configuration";
import { WebApp } from "meteor/webapp";

WebApp.connectHandlers.use((req, res, next) => {
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
	next();
});

Meteor.startup(async () => {
	ServiceConfiguration.configurations.updateAsync(
		{ service: "google" },
		{
			$set: {
				clientId: "",
				secret: "",
				loginStyle: "popup",
			},
		},
		{ upsert: true }
	);
});
