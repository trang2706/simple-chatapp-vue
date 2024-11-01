<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},

	preDate: {
		type: Date,
		required: true,
	},

	index: {
		type: Number,
	},
});

const messageRef = ref({ ...props.message });
const username = ref("");

onMounted(() => {
	getUsername();
});

const getUsername = async () => {
	try {
		username.value = await Meteor.callAsync(
			"getUsername",
			messageRef.value.senderId
		);
		return username;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const getTime = (date) => {
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getDate = (date) => {
	return date.toLocaleDateString("en-GB");
};

const addDivider = (date) => {
	if (props.preDate) {
		if (props.preDate.toLocaleDateString() == date.toLocaleDateString()) {
			return false;
		}
	}

	return true;
};

const checkMine = () => {
	if (Meteor.userId() == messageRef.value.senderId) {
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
</script>

<template>
	<li v-if="addDivider(message.createdAt)" class="w-full">
		<div class="divider relative text-center">
			<h6>{{ getDate(message.createdAt) }}</h6>
		</div>
	</li>
	<li v-if="!checkMine()" class="sender">
		<span class="time">{{ getTime(message.createdAt) }}</span>
		<p class="bg-gray-100 text-black">{{ message.text }}</p>
	</li>
	<li v-else class="reply self-end">
		<span class="time">{{ getTime(message.createdAt) }}</span>
		<p class="bg-blue-500 text-white">{{ message.text }}</p>
	</li>
	<!-- <li>
		<div class="divider">
			<h6>Today</h6>
		</div>
	</li> -->
</template>

<style>
li {
	list-style: none;
	margin: 15px 0;
	width: 60%;
}

li.sender {
	display: block;
	position: relative;
}

li p {
	font-size: 14px;
	line-height: 1.5;
	font-weight: 400;
	padding: 4px;
	padding-inline: 12px;
	display: inline-block;
	border-radius: 10px;
	margin-bottom: 0;
}

li.reply {
	display: block;
	text-align: right;
	position: relative;
}

.time {
	display: block;
	color: #000;
	font-size: 12px;
	line-height: 1.5;
	font-weight: 400;
}

.divider {
	z-index: 1;
}

.divider h6 {
	text-align: center;
	font-weight: normal;
	font-size: 14px;
	line-height: 1.5;
	color: #222;
	background: #fff;
	display: inline-block;
	padding: 0 5px;
	margin-bottom: 0;
}
</style>
