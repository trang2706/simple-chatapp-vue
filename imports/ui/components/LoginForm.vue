<script setup>
import { Meteor } from "meteor/meteor";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const error = ref("");

const login = () => {
	Meteor.loginWithPassword(username.value, password.value, (err) => {
		if (err) {
			error.value =
				"Something went wrong. Please check your credentials.";
		}
	});
};

const register = () => {};
</script>

<template>
	<form
		class="flex flex-col justify-center items-center w-full max-w-md mx-auto my-8 border border-gray-200 py-8 rounded"
		@submit.prevent="login"
	>
		<div>
			<label
				for="username"
				class="block text-gray-700 text-sm font-bold mb-2"
				>Username</label
			>
			<input
				v-model="username"
				type="text"
				name="username"
				placeholder="Username"
				required
				class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-60"
			/>
		</div>

		<div class="mt-4">
			<label
				for="password"
				class="block text-gray-700 text-sm font-bold mb-2"
				>Password</label
			>
			<input
				v-model="password"
				type="password"
				name="password"
				placeholder="Password"
				required
				class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-60"
			/>
		</div>

		<div>
			<button
				type="submit"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-4 px-4 rounded focus:outline-none focus:shadow-outline w-60"
			>
				Log in
			</button>
		</div>

		<p class="text-red-500 pt-2" v-if="error">{{ error }}</p>

		<div class="flex items-center px-4 pt-4 justify-end w-full">
			<!-- <div class="cursor-pointer hover:underline text-blue-500">
				Forgot your password?
			</div> -->
			<div
				class="cursor-pointer self-end hover:underline text-blue-500"
				@click="$emit('createAccount')"
			>
				Create account
			</div>
		</div>
	</form>
</template>
