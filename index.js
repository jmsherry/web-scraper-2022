import fs from "fs";
import axios from "axios";
import jsdom from "jsdom";

const { TARGET_URL = "", LOG_NAME = "" } = process.env;

const resp = await axios.default.get(TARGET_URL);

// Save to file
fs.writeFileSync(`${LOG_NAME || TARGET_URL}`, resp.data);

// Interrogate
const dom = new jsdom.JSDOM(resp.data);
const { document } = dom.window;

const h1s = document.querySelectorAll("h1");

for (const h1 of h1s) {
  console.log(h1.textContent, "\n\n");
}
