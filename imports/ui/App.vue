<script setup>
import { subscribe, autorun } from "vue-meteor-tracker";
import { Meteor } from "meteor/meteor";
import { ref, watch, onMounted } from "vue";
import ChatList from "./components/ChatList.vue";
import ChatBox from "./components/ChatBox.vue";
import SignInUpForm from "./components/SignInUpForm.vue";

const isLogged = ref(false);
const isOpenDropdown = ref(false);
const selectedUserId = ref("");

const userId = autorun(() => Meteor.userId()).result;

const logout = () => {
	isOpenDropdown.value = false;
	Meteor.logout();
};

onMounted(() => {
	getLastUserId();
});

watch(
	() => userId.value,
	(newUserId) => {
		isLogged.value = !!newUserId;
	},
	{ immediate: true }
);

subscribe("messages");

const toggleDropdown = () => {
	isOpenDropdown.value = !isOpenDropdown.value;
};

const selectUser = (user) => {
	selectedUserId.value = user._id;
};

const getLastUserId = async () => {
	try {
		const userId = Meteor.userId(); // Assuming the user is logged in
		if (userId) {
			const lastMessage = await Meteor.callAsync(
				"getLastMessage",
				userId
			);

			if (lastMessage) {
				if (lastMessage.senderId == userId) {
					selectedUserId.value = lastMessage.receiverId;
				} else {
					selectedUserId.value = lastMessage.senderId;
				}
			}
		}
	} catch (error) {
		console.error("Error fetching last receiver:", error);
	}
};
</script>

<template>
	<div
		v-if="isLogged"
		class="flex w-screen h-screen overflow-hidden relative animate__animated animate__fadeIn"
	>
		<div
			class="flex flex-col w-16 min-w-16 justify-between items-center bg-gray-100"
		>
			<i
				class="fa-solid fa-comment w-6 h-6 p-2 text-orange-300 bg-gray-200 rounded-md mt-4"
			></i>

			<div class="relative">
				<img
					border="0"
					height="40"
					hspace="0"
					src="/images/user.png"
					width="40"
					class="pb-4 cursor-pointer"
					@click="toggleDropdown"
				/>

				<div
					class="dropdown absolute top-[-82px] bg-gray-200 text-gray-700 rounded-lg py-2 px-2 font-medium w-32"
					:class="{ hidden: !isOpenDropdown }"
					@blur="toggleDropdown"
				>
					<p
						class="cursor-pointer rounded hover:bg-gray-300 py-1 px-2"
					>
						Profile
					</p>
					<p
						class="cursor-pointer text-red-500 hover:bg-gray-300 rounded py-1 px-2"
						@click="logout"
					>
						Logout
					</p>
				</div>
			</div>
		</div>

		<ChatList
			@selectUser="selectUser"
			:selected-user-id="selectedUserId"
			:key="selectedUserId"
		/>

		<ChatBox :receiver-id="selectedUserId" :key="selectedUserId" />
	</div>

	<div
		v-else
		class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate__animated animate__fadeIn"
	>
		<header class="text-center items-center justify-between px-4 py-4">
			<h1 class="text-4xl font-bold text-gray-800 my-4">
				Welcome to Chat App
			</h1>
		</header>

		<SignInUpForm />
	</div>
</template>

<style></style>
