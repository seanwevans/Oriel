import { register } from "node:module";

register("./htmlRawLoader.mjs", new URL("./", import.meta.url));
