import fs from "fs";
import axios from "axios";
import { JSDOM } from "jsdom";

const URLS = [];

const {
  TARGET_URL = "",
  TARGET_DIR = "searches",
  LOG_FILE = "test.log",
} = process.env;

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

const scrape = async (url) => {
  // Make sure we scrape only once (because nav!)
  if (URLS.includes(url)) return;
  URLS.push(url);

  fs.writeFileSync(LOG_FILE, `file to process: ${url}\n\n`, {
    flag: "a",
  });

  // Must be full URLs
  const SUB_URL = new URL(url.startsWith("/") ? `${ORIGIN}${url}` : url);
  fs.writeFileSync(LOG_FILE, `pathname: ${SUB_URL.pathname}\n\n`, {
    flag: "a",
  });

  const isRootPath = SUB_URL.pathname === "/" || SUB_URL.pathname === "";
  if (isRootPath) URLS.push("/");

  const isStaticFile = SUB_URL.pathname.endsWith(".html");
  const hasTrailingSlash = !isRootPath && SUB_URL.pathname.endsWith("/");

  // /, /qwe.html, /jkl/
  let fileName = "";

  if (isRootPath) {
    fileName = "index.html";
  } else if (hasTrailingSlash) {
    fileName = `${SUB_URL.pathname.split("/").at(-2)}.html`;
  } else if (!hasTrailingSlash) {
    fileName = `${SUB_URL.pathname.split("/").at(-1)}.html`;
  } else if (isStaticFile) {
    fileName = SUB_URL.pathname.split("/").at(-1);
  }

  // const fileName = isRootPath
  //   ? "index.html"
  //   : isStaticFile
  //   ? SUB_URL.pathname.split("/").at(-1)
  //   : `${SUB_URL.pathname.split("/").at(-1)}.html`;

  try {
    // console.log("🚀 ~ file: index.js ~ line 22 ~ scrape ~ fileName", fileName);
    fs.writeFileSync(LOG_FILE, `fileName: ${fileName}\n\n`, { flag: "a" });

    // console.log("🚀 ~ file: index.js ~ line 25 ~ scrape ~ queryPath", queryPath);
    fs.writeFileSync(LOG_FILE, `SUB_URL ${SUB_URL.toString()}\n\n`, {
      flag: "a",
    });
  } catch (err) {
    console.log(err);
  }

  try {
    const resp = await axios.get(SUB_URL.toString());
    fs.writeFileSync(`${DIR}/${fileName}`, resp.data, { flag: "a" });

    // Interrogate
    const dom = new JSDOM(resp.data);
    const { document } = dom.window;

    const links = document.querySelectorAll("a");

    for (const link of links) {
      const { href } = link;
      fs.writeFileSync(LOG_FILE, `Found ${href}\n\n`, { flag: "a" });
      const isSiteLink = href.startsWith("/") || href.includes(ORIGIN);
      if (isSiteLink) {
        scrape(href); // this recursion is the crawling behaviour
      }
    }

    fs.writeFileSync(
      LOG_FILE,
      `
    *******************************************************************
    *******************************************************************
    \n\n
    `,
      {
        flag: "a",
      }
    );
  } catch (err) {
    console.log("err", fileName, err);
  }
};

scrape(TARGET_URL);
