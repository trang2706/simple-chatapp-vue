<script setup>
import LoginForm from "./components/LoginForm.vue";
import { subscribe, autorun } from "vue-meteor-tracker";
import { Meteor } from "meteor/meteor";
import { ref, watch } from "vue";
import Message from "./components/Message.vue";
import MessageForm from "./components/MessageForm.vue";
import { MessagesCollection } from "../api/messagesCollection";
import RegisterForm from "./components/RegisterForm.vue";

const isLogged = ref(false);
const isLoginForm = ref(true);

const userId = autorun(() => Meteor.userId()).result;

const logout = () => Meteor.logout();

watch(
	() => userId.value,
	(newUserId) => {
		isLogged.value = !!newUserId;
	},
	{ immediate: true }
);

subscribe("messages");

const messages = autorun(() => {
	return MessagesCollection.find({}, { sort: { createdAt: 1 } }).fetch();
}).result;

const toggleForm = () => {
	isLoginForm.value = !isLoginForm.value;
};
</script>

<template>
	<div>
		<div>
			<header
				class="flex items-center justify-between px-4 py-4 bg-gray-100 border-t border-b border-gray-200 fixed w-full"
			>
				<h1 class="text-4xl font-bold text-gray-800 my-4">Chat App</h1>

				<button
					v-if="isLogged"
					class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					@click="logout"
				>
					Logout
				</button>
			</header>
		</div>
		<div v-if="isLogged">
			<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pt-28">
				<div
					class="mb-8 md:w-120 md:mx-auto md:mb-0 md:mt-8 md:px-4 md:py-8 text-center md:border md:rounded-lg"
				>
					<ul
						v-if="messages.length !== 0"
						class="list-none list-inside pt-4 flex flex-col w-auto"
					>
						<Message
							v-for="message of messages"
							:key="message._id"
							:message="message"
						/>
					</ul>
					<p v-else>No messages.</p>
				</div>

				<MessageForm></MessageForm>
			</div>
		</div>

		<div v-else class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pt-28">
			<LoginForm v-if="isLoginForm" @createAccount="toggleForm" />
			<RegisterForm v-else @login="toggleForm" />
		</div>
	</div>
</template>
