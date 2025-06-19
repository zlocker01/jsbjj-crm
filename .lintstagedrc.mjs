import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  "*.{js,mjs,jsx,ts,tsx}": ["biome format --write --ignore-unknown"],
  "*.{json,md,mdx,css,scss,html}": ["biome format --write --ignore-unknown"],
};
