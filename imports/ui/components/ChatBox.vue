<script setup>
import Message from "./Message.vue";
import MessageForm from "./MessageForm.vue";
import { MessagesCollection } from "/imports/api/messagesCollection";
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from "vue";
import { Tracker } from "meteor/tracker";

const props = defineProps({
	receiverId: {
		type: String,
	},
});

const userId = Meteor.userId();
const receiver = ref(null);
const messages = ref([]);
let trackerHandle;
const chatContainer = ref(null);

onMounted(async () => {
	// Get user information
	await getUser();

	// Using Tracker.autorun to set up a reactive data source
	trackerHandle = Tracker.autorun(() => {
		const newMessages = MessagesCollection.find(
			{
				$or: [
					{ senderId: userId, receiverId: props.receiverId },
					{ senderId: props.receiverId, receiverId: userId },
				],
			},
			{ sort: { createdAt: 1 } }
		).fetch();

		messages.value = newMessages; // Trigger Vue reactivity
	});
});

onBeforeUnmount(() => {
	trackerHandle?.stop(); // Clean up on unmount
});

// Watch for new messages and scroll to bottom
watch(messages, () => {
	scrollToBottom();
});

/**
 * Scroll to down when displaying or getting a new message
 */
const scrollToBottom = async () => {
	// Ensure DOM is updated
	await nextTick();

	if (chatContainer.value) {
		chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
	}
};

/**
 * Get user information
 */
const getUser = async () => {
	try {
		receiver.value = await Meteor.callAsync("getUser", props.receiverId);

		return receiver.value;
	} catch (error) {
		console.error(error);
		return null;
	}
};
</script>

<template>
	<div v-if="receiverId" class="w-full h-full overflow-hidden">
		<div class="h-full">
			<div
				class="overflow-hidden max-h-full h-full relative flex flex-col w-full pointer-event-auto"
			>
				<div class="p-4 border-b">
					<div class="flex flex-wrap">
						<div class="w-full">
							<div
								v-if="receiver"
								class="flex items-center gap-2"
							>
								<img
									border="0"
									height="36"
									width="36"
									hspace="0"
									src="/images/user.png"
									alt="avatar"
								/>
								<p class="font-bold text-gray-700">
									{{ receiver.profile.name }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div
					id="msg-body"
					ref="chatContainer"
					class="relative overflow-y-auto flex-auto pl-4 pr-8"
				>
					<div v-if="messages.length !== 0" class="msg-body">
						<ul
							class="list-none list-inside pt-4 flex flex-col w-auto"
						>
							<Message
								v-for="(message, index) in messages"
								:key="message._id"
								:message="message"
								:pre-date="
									index == 0
										? null
										: messages[index - 1].createdAt
								"
								:index="index"
							/>
						</ul>
					</div>
					<div v-else class="h-full flex justify-center items-center">
						<p class="text-xl">No messages.</p>
					</div>
				</div>

				<div class="send-box pl-4 pr-8">
					<MessageForm :receiver-id="receiverId" />
				</div>
			</div>
		</div>
	</div>
	<div
		v-else
		class="w-full h-full flex items-center justify-center p-4 text-center"
	>
		<p class="text-3xl text-blue-500">Please select someone to text!</p>
	</div>
</template>

<style></style>
