<script setup>
import { Accounts } from "meteor/accounts-base";
import { ref } from "vue";
import { Meteor } from "meteor/meteor";

const username = ref("");
const password = ref("");
const error = ref("");

const register = async () => {
	await Meteor.call(
		"insertUser",
		{
			username: username.value.trim(),
			password: password.value,
		},
		(err, result) => {
			console.log("123", err);
			if (err) {
				if (err.error === "username-exists") {
					error.value =
						"This username is already taken. Please choose another.";
				} else {
					error.value = "Something went wrong. Please try again.";
				}
			} else {
				error.value = "";
			}
		}
	);
	username.value = "";
	password.value = "";
};
</script>

<template>
	<form
		class="flex flex-col justify-center items-center w-full max-w-md mx-auto my-8 border border-gray-200 py-8 rounded"
		@submit.prevent="register"
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
				Create Account
			</button>
		</div>

		<p class="text-red-500 pt-2" v-if="error">{{ error }}</p>

		<div
			class="cursor-pointer self-end px-4 pt-4 hover:underline text-blue-500"
			@click="$emit('login')"
		>
			Log in
		</div>
	</form>
</template>
