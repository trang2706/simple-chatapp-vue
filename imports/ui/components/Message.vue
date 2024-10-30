<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},
});

const messageRef = ref({ ...props.message });
const username = ref("");

const getUsername = async () => {
	try {
		username.value = await Meteor.callAsync(
			"getUsername",
			messageRef.value.userId
		);
		return username;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const formatDate = (date) => {
	return date.toLocaleString();
};

const checkMine = () => {
	if (Meteor.userId() == messageRef.value.userId) {
		return true;
	}

	return false;
};

const deleteMessage = async () => {
	try {
		await Meteor.callAsync("removeMessage", messageRef.value._id);
	} catch (error) {
		console.error("Error deleting message:", error);
	}
};

onMounted(() => {
	getUsername();
});
</script>

<template>
	<div v-if="!checkMine()" class="flex flex-col items-start w-[90%]">
		<div class="text-left text-gray-400">
			<b class="text-gray-500">{{ username }}</b> ({{
				formatDate(message.createdAt)
			}})
		</div>

		<div
			class="flex items-center rounded p-4 py-2 mb-2 shadow-sm border border-gray-200"
		>
			<span class="text-gray-600 px-2 text-left">
				{{ message.text }}
			</span>
		</div>
	</div>
	<div v-else class="self-end flex flex-col items-end w-[90%]">
		<div class="text-left text-gray-400">
			{{ formatDate(message.createdAt) }}
		</div>

		<div
			class="flex items-center rounded p-4 py-2 mb-2 shadow-sm border border-gray-200 bg-blue-500 relative"
		>
			<button
				class="bg-red-500 hover:bg-red-600 text-white font-bold rounded-[50%] h-4 w-4 absolute text-xs top-[-6px] right-[-6px] cursor-pointer"
				@click="deleteMessage"
			>
				&times;
			</button>

			<span class="text-white px-2 text-left">
				{{ message.text }}
			</span>
		</div>
	</div>
</template>
