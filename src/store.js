import { writable } from "svelte/store";

export const tokenStatus = writable(null);

export const pageStore = writable(1);