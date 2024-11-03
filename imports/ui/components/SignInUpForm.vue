<script setup>
import { Meteor } from "meteor/meteor";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import GoogleIcon from "@assets/icons/google-icon.svg";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const nameRef = ref(null);

onMounted(() => {
	const signUpButton = document.getElementById("signUp");
	const signInButton = document.getElementById("signIn");
	const container = document.getElementById("container");
	signUpButton.addEventListener("click", () => {
		container.classList.add("right-panel-active");
		resetForm();
	});
	signInButton.addEventListener("click", () => {
		container.classList.remove("right-panel-active");
		resetForm();
	});
});

/**
 * Login chat app
 */
const login = () => {
	Meteor.loginWithPassword(email.value, password.value, (err) => {
		if (err) {
			error.value = "Please check your credentials.";
		}
	});
};

/**
 * Create user account
 */
const register = async () => {
	// insert new user
	await Meteor.call(
		"insertUser",
		{
			name: name.value.trim(),
			email: email.value.trim(),
			password: password.value,
		},
		(err, result) => {
			if (err) {
				if (err.error === "email-exists") {
					error.value = err.reason;
				} else {
					error.value = "Something went wrong. Please try again.";
				}
			} else {
				resetForm();

				// Focus first input after registering
				nameRef.value.focus();
			}
		}
	);
};

/**
 * Reset form
 */
const resetForm = () => {
	name.value = "";
	email.value = "";
	password.value = "";
	error.value = "";
};

/**
 * Login with google
 */
const loginWithGoogle = () => {
	Meteor.loginWithGoogle({}, (err) => {
		if (!err) {
			// successful authentication
			router.push({ name: "home" });
		} else {
			// failed authentication
			console.error(err);
		}
	});
};
</script>

<template>
	<div class="container" id="container">
		<!-- sign up form -->
		<div class="form-container sign-up-container">
			<form @submit.prevent="register">
				<h1 class="mb-2">Create Account</h1>
				<input
					v-model="name"
					ref="nameRef"
					type="text"
					placeholder="Name"
					autocomplete="off"
					required
				/>
				<input
					v-model="email"
					type="email"
					placeholder="Email"
					autocomplete="off"
					required
				/>
				<input
					v-model="password"
					type="password"
					placeholder="Password"
					autocomplete="off"
					required
				/>
				<button class="mt-4">Sign Up</button>

				<span class="my-4 text-red-700" :class="{ hidden: !error }">{{
					error
				}}</span>

				<span class="m-4">or</span>
				<button
					class="google h-[44px] flex gap-2 items-center justify-center border-none"
					@click="loginWithGoogle"
				>
					<GoogleIcon height="20" width="20" />
					<p class="my-1">Sign in with Google</p>
				</button>
			</form>
		</div>
		<!-- sign up form -->

		<!-- sign in form -->
		<div class="form-container sign-in-container">
			<form @submit.prevent="login">
				<h1 class="mb-2">Sign in</h1>
				<input
					v-model="email"
					type="email"
					placeholder="Email"
					autocomplete="off"
					required
				/>
				<input
					v-model="password"
					type="password"
					placeholder="Password"
					autocomplete="off"
					required
				/>
				<a href="#">Forgot your password?</a>
				<button type="submit" class="w-full">Sign In</button>

				<span class="my-4 text-red-700" :class="{ hidden: !error }">{{
					error
				}}</span>

				<span class="my-4">or</span>
				<button
					type="button"
					class="google h-[44px] flex gap-2 items-center justify-center border-none"
					@click="loginWithGoogle"
				>
					<GoogleIcon height="20" width="20" />
					<p class="my-1">Sign in with Google</p>
				</button>
			</form>
		</div>
		<!-- sign in form -->

		<div class="overlay-container">
			<div class="overlay">
				<div class="overlay-panel overlay-left">
					<h1>Welcome Back!</h1>
					<p>
						To keep connected with us please login with your
						personal info
					</p>
					<button class="ghost" id="signIn">Sign In</button>
				</div>
				<div class="overlay-panel overlay-right">
					<h1>Welcome!</h1>
					<p>Enter your personal details and start journey with us</p>
					<button class="ghost" id="signUp">Sign Up</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
h1 {
	font-weight: bold;
	margin: 0;
	font-size: 20px;
}

.overlay-panel p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #ffb26f;
	background-color: #ffb26f;
	color: #ffffff;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
	width: 100%;
}

button.ghost {
	background-color: transparent;
	border-color: #ffffff;
	width: 150px;
}

button.google {
	background-color: #f3f4f6;
	border-color: #f3f4f6;
	color: #1f2937;
	padding: 12px;
	text-transform: none;
	font-weight: normal;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

form {
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

input {
	background-color: #eee;
	border: none;
	padding: 10px 16px;
	margin: 8px 0;
	width: 100%;
	border-radius: 20px;
}

input:focus-visible {
	outline: #fbd288 auto 1px;
}

.container {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%,
	49.99% {
		opacity: 0;
		z-index: 1;
	}

	50%,
	100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container.right-panel-active .overlay-container {
	transform: translateX(-100%);
}

.overlay {
	background: -webkit-linear-gradient(to right, #ffb26f, #ff9c73);
	background: linear-gradient(to right, #ffb26f, #ff9c73);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #ffffff;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}
</style>
