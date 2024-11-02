import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "path";

export default defineConfig({
	plugins: [vue(), svgLoader()],

	meteor: {
		clientEntry: "imports/ui/main.js",
	},
	optimizeDeps: {
		exclude: ["vue-meteor-tracker"],
	},
});
