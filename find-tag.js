import fs from "fs";
import axios from "axios";
import { JSDOM } from "jsdom";


const { TARGET_URL = "", TARGET_DIR = "searches", LOG_FILE="test.log", TARGET_TAG="*"} = process.env;

const MASTER_URL = new URL(TARGET_URL);
const ORIGIN = MASTER_URL.origin;
const HOSTNAME = MASTER_URL.hostname;
console.log("🚀 ~ file: index.js ~ line 9 ~ HOSTNAME", MASTER_URL.hostname);
console.log("🚀 ~ file: index.js ~ line 10 ~ ORIGIN", MASTER_URL.origin);

const DIR = `${TARGET_DIR}/${HOSTNAME}`;
console.log("🚀 ~ file: index.js ~ line 14 ~ DIR", DIR);

try {
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
  }
} catch (err) {
  console.error(err);
}

const find = async () => {

  try {
    const resp = await axios.get(TARGET_URL);

    // Interrogate
    const dom = new JSDOM(resp.data);
    const { document } = dom.window;

    const tags = document.querySelectorAll(TARGET_TAG);

    for (const tag of tags) {
      const text = `${JSON.stringify(tag.outerHTML)}\n\n`
      fs.writeFileSync(LOG_FILE, text, { flag: "a" });
      fs.writeFileSync(`${DIR}/${HOSTNAME}-${TARGET_TAG}.html`, text, { flag: "a" });
    }
  } catch (err) {
    console.log("err", err);
  }
};

find();
