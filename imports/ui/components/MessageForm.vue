<script setup>
import { ref } from "vue";
import { Meteor } from "meteor/meteor";

const props = defineProps({
	receiverId: {
		type: String,
		required: true,
	},
});

const newMessage = ref("");

const addMessage = async () => {
	if (newMessage.value) {
		await Meteor.callAsync("insertMessage", {
			text: newMessage.value.trim(),
			receiverId: props.receiverId,
		});
		newMessage.value = "";
	}
};
</script>

<template>
	<form
		@submit.prevent="addMessage"
		class="flex items-center justify-between my-3"
	>
		<textarea
			rows="2"
			v-model="newMessage"
			class="border border-gray-300 rounded-2xl py-2 px-4 mr-2 text-gray-600 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 max-h-40 w-full max-w-full resize-none"
			type="text"
			placeholder="Type a message..."
		/>

		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded h-10 self-center flex items-center gap-1"
		>
			<i class="fa fa-paper-plane" aria-hidden="true"></i>
			Send
		</button>
	</form>
</template>
