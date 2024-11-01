<script setup>
import { onMounted, ref, watch } from "vue";
import { autorun } from "vue-meteor-tracker";

const emits = defineEmits(["selectUser"]);

const props = defineProps({
	selectedUserId: {
		type: String,
	},
});

const username = ref("");
const allUsers = ref([]);
const searchUsers = ref([]);
const uniqueReceivers = ref([]);

const usersSub = Meteor.subscribe("allUsers");
autorun(() => {
	if (usersSub.ready()) {
		allUsers.value = Meteor.users.find().fetch();
	}
});

onMounted(() => {
	getUniqueReceivers();
});

watch(username, () => {
	searchUser(username.value);
});

const getUniqueReceivers = async () => {
	try {
		const userId = Meteor.userId();
		if (userId) {
			uniqueReceivers.value = await Meteor.callAsync(
				"getUniqueReceivers",
				userId
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
		user.username.includes(username)
	);
};

/**
 * Select user to text/read message
 * @param user
 */
const selectUser = (user) => {
	emits("selectUser", user);
	uniqueReceivers.value.unshift(user);
	console.log("push user", uniqueReceivers.value);

	uniqueReceivers.value = uniqueReceivers.value.filter(
		(id, index) => uniqueReceivers.value.indexOf(id) === index
	);

	console.log("select user", uniqueReceivers.value);

	username.value = "";
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
						<h1
							class="text-2xl font-bold text-gray-800 my-3 text-orange-300"
						>
							Chat App
						</h1>
					</header>
					<input
						v-model="username"
						type="text"
						name="username"
						placeholder="Search"
						autocomplete="off"
						class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full bg-gray-100"
					/>

					<div v-if="username">
						<ul>
							<template v-for="user of searchUsers">
								<div
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
									<p>{{ user.username }}</p>
								</div>
							</template>
						</ul>
					</div>
				</div>

				<div
					v-if="!username"
					class="relative overflow-y-auto flex-auto mb-3"
				>
					<template v-for="user of uniqueReceivers">
						<div
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
							<p>{{ user.username }}</p>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
	<!-- chatlist -->
</template>
