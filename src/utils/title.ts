import { createEffect, createSignal } from "solid-js";

const [title, setTitle] = createSignal("");

createEffect(() => {
    document.title = `${title()} - Known Board`;
})

export { setTitle };