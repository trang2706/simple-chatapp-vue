<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import { autorun } from "vue-meteor-tracker";
import { Tracker } from "meteor/tracker";
import { MessagesCollection } from "/imports/api/messagesCollection";

const emits = defineEmits(["selectUser"]);

const name = ref("");
const allUsers = ref([]);
const searchUsers = ref([]);
const chatUserList = ref([]);
const selectedUserId = ref(null);
const messages = ref([]);
const userId = Meteor.userId();
let trackerHandle;

const usersSub = Meteor.subscribe("allUsers");
autorun(() => {
	if (usersSub.ready()) {
		allUsers.value = Meteor.users.find().fetch();
	}
});

onMounted(() => {
	getLastUserId();

	// Using Tracker.autorun to set up a reactive data source
	trackerHandle = Tracker.autorun(() => {
		try {
			const newMessages = MessagesCollection.find(
				{
					$or: [{ senderId: userId }, { receiverId: userId }],
				},
				{ sort: { createdAt: -1 } }
			).fetch();
			messages.value = newMessages; // Trigger Vue reactivity

			// After updating messages, populate chatUserList
			getContactedUsers();
		} catch (error) {
			console.error(error);
		}
	});
});

onBeforeUnmount(() => {
	trackerHandle?.stop(); // Clean up on unmount
});

watch(name, () => {
	searchUser(name.value);
});

/**
 * Get all users who contracted with current user
 */
const getContactedUsers = async () => {
	try {
		if (userId && messages.value) {
			const userIdsInChat = new Set();

			// const messages = await Meteor.callAsync("getMessagesById", userId);

			messages.value.forEach((message) => {
				const otherUserId =
					message.senderId === userId
						? message.receiverId
						: message.senderId;

				userIdsInChat.add(otherUserId);
			});

			// Fetch user data based on unique IDs
			chatUserList.value = Array.from(userIdsInChat).map((userId) =>
				Meteor.users.findOne({ _id: userId })
			);
		}
	} catch (error) {
		console.error("Error fetching unique receivers:", error);
	}
};

/**
 * Search user
 * @param username
 */
const searchUser = (username) => {
	searchUsers.value = allUsers.value.filter((user) =>
		user.profile.name.toLowerCase().includes(username.toLowerCase())
	);
};

/**
 * Select user to text/read message
 * @param user
 */
const selectUser = (user) => {
	if (user && user._id) {
		emits("selectUser", user);

		selectedUserId.value = user._id;

		// Check if the user is already in chatUserList
		if (!chatUserList.value.some((chatUser) => chatUser._id === user._id)) {
			chatUserList.value.unshift(user); // Add selected user to chatUserList
		}
	}

	name.value = "";
};

/**
 * Get last user who sent/receive message to current user
 */
const getLastUserId = async () => {
	try {
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
	<!-- chatlist -->
	<div
		class="w-80 min-w-80 flex flex-col border-r px-3 h-full overflow-hidden"
	>
		<div class="h-full">
			<div
				class="relative flex flex-col max-h-full h-full overflow-hidden w-full"
			>
				<div class="flex flex-col pb-3">
					<header class="flex items-center justify-between px-3 py-3">
						<h1 class="text-2xl font-bold my-3 text-orange-300">
							Chat App
						</h1>
					</header>
					<input
						v-model="name"
						type="text"
						name="name"
						placeholder="Search"
						autocomplete="off"
						class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full bg-gray-100"
					/>

					<div :class="{ hidden: !name }">
						<ul class="my-1">
							<template v-for="user of searchUsers">
								<div
									v-if="user && user.profile"
									class="flex gap-2 items-center py-2 cursor-pointer hover:bg-gray-100 rounded-md"
									@click="selectUser(user)"
								>
									<img
										border="0"
										height="32"
										width="32"
										hspace="0"
										src="/images/user.png"
										alt="avatar"
									/>
									<p>{{ user.profile.name }}</p>
								</div>
							</template>
						</ul>
					</div>
				</div>

				<div
					class="relative overflow-y-auto flex-auto mb-3"
					:class="{ hidden: name }"
				>
					<template v-for="user of chatUserList">
						<div
							v-if="user && user._id"
							class="flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md my-1"
							:class="
								user._id == selectedUserId
									? 'bg-gray-200 hover:bg-gray-200'
									: ''
							"
							@click="selectUser(user)"
						>
							<img
								border="0"
								height="40"
								width="40"
								hspace="0"
								src="/images/user.png"
								alt="avatar"
							/>
							<p>{{ user.profile.name }}</p>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
	<!-- chatlist -->
</template>
