<script setup>
import { subscribe, autorun } from "vue-meteor-tracker";
import { Meteor } from "meteor/meteor";
import { ref, watch, onMounted, onUnmounted } from "vue";
import ChatList from "./components/ChatList.vue";
import ChatBox from "./components/ChatBox.vue";
import SignInUpForm from "./components/SignInUpForm.vue";

const isLogged = ref(false);
const selectedUserId = ref("");
const isDropdownVisible = ref(false);
const dropdownContainer = ref(null);
const user = ref(null);
const userId = autorun(() => Meteor.userId()).result;

onMounted(async () => {
	// Accounts.onLogin fixed when loading initially and login, not show the most recent contact
	Accounts.onLogin(async () => {
		selectedUserId.value = await getLastUserId();
	});

	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

watch(
	() => userId.value,
	async (newUserId) => {
		isLogged.value = !!newUserId;

		// Get current user information
		if (newUserId) {
			try {
				user.value = await Meteor.callAsync("getUser", newUserId);
			} catch (error) {
				console.error(error);
				return null;
			}
		}
	},
	{ immediate: true }
);

subscribe("messages");

/**
 * Toggle dropdown when click account avatar
 */
const toggleDropdown = () => {
	isDropdownVisible.value = !isDropdownVisible.value;
};

/**
 * Click outside dropdown, close dropdown
 *
 * @param e click event
 */
const handleClickOutside = (e) => {
	if (
		dropdownContainer.value &&
		!dropdownContainer.value.contains(e.target) &&
		isDropdownVisible.value
	) {
		isDropdownVisible.value = !isDropdownVisible.value;
	}
};

/**
 * Logout when click logout in dropdown
 */
const logout = () => {
	isDropdownVisible.value = false;
	Meteor.logout();
};

const selectUser = (user) => {
	selectedUserId.value = user._id;
};

/**
 * Get last user who current user contracted
 */
const getLastUserId = async () => {
	try {
		const userId = Meteor.userId();

		if (userId) {
			const lastMessage = await Meteor.callAsync(
				"getLastMessage",
				userId
			);

			if (lastMessage) {
				if (lastMessage.senderId == userId) {
					return lastMessage.receiverId;
				} else {
					return lastMessage.senderId;
				}
			}
		}

		return null;
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

			<div ref="dropdownContainer" class="relative">
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
					class="dropdownContainer absolute top-[-82px] bg-gray-200 text-gray-700 rounded-lg py-2 px-2 font-medium w-32 z-[1]"
					:class="{ hidden: !isDropdownVisible }"
				>
					<p
						v-if="user && user.profile"
						class="cursor-pointer rounded hover:bg-gray-300 py-1 px-2"
					>
						{{ user.profile.name }}
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
			class="animate__animated animate__fadeIn"
			@selectUser="selectUser"
		/>

		<ChatBox
			class="animate__animated animate__fadeIn"
			:receiver-id="selectedUserId"
			:key="selectedUserId"
		/>
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
