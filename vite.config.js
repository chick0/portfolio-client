import { execSync } from "child_process";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import purgecss from "@fullhuman/postcss-purgecss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "src/variables.scss" as *;',
            },
        },

        postcss: {
            plugins: [
                purgecss({
                    content: ["./src/**/*.svelte"],
                    safelist: ["html", "body", "button"],
                }),
            ],
        },
    },

    define: {
        GIT_HASH: JSON.stringify(execSync("git rev-parse HEAD").toString().trim()),
        GIT_REMOTE: JSON.stringify(execSync("git remote get-url origin").toString().trim()),
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
        STATUS_URL: JSON.stringify("https://status.ch1ck.xyz"),

        // app config
        NAME: JSON.stringify("chick_0"),
        GITHUB: JSON.stringify("https://github.com/chick0"),
        EMAIL: JSON.stringify("chick_0@ch1ck.xyz"),
        BLOG: JSON.stringify("https://blog.ch1ck.xyz")
    },
});
