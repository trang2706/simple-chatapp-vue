<script setup>
import { ref } from "vue";
import { Meteor } from "meteor/meteor";

const newMessage = ref("");

const addMessage = async () => {
	if (newMessage.value) {
		await Meteor.callAsync("insertMessage", newMessage.value.trim());
		newMessage.value = "";
	}
};
</script>

<template>
	<form @submit.prevent="addMessage" class="flex">
		<textarea
			rows="3"
			v-model="newMessage"
			class="border border-gray-300 rounded-md py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 w-full mt-2 min-h-16"
			type="text"
			placeholder="Write a message..."
		/>
		<button
			class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded h-10 self-center"
			type="submit"
		>
			Send
		</button>
	</form>
</template>
