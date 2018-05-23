const puppeteer = require("puppeteer");
const normalizeUrl = require("normalize-url");

class Scrapper {
  constructor(props) {
    this.data = props.data;
    return this;
  }

  async init() {
    await this.setCookies();
    await this.setArgs();
    await this.launchBrowser();
    await this.launchPage();
    return this;
  }

  setCookies() {
    try {
      switch (typeof this.data.cookies) {
        case "string":
          this.cookies = JSON.parse(this.data.cookies);
          break;
        case "object":
          this.cookies = this.data.cookies;
          break;
        default:
          this.cookies = [];
          break;
      }
    } catch (e) {
      console.log("cannot parse cookies");
      this.cookies = [];
    }
    return this;
  }

  setArgs() {
    const args = [
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
      "--no-sandbox"
    ];
    if (this.data.proxy) {
      args.push(`--proxy-server=${this.data.proxy}`);
    }
    this.args = args;
    this.data.url = normalizeUrl(this.data.url);
    this.navigationArgs = { waitUntil: "networkidle2" };
    this.viewportArgs = { width: 800, height: 800 };
    return this;
  }

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      // executablePath: __dirname + "/headless-chromium",
      args: this.args
    });
    return this;
  }

  async launchPage() {
    this.page = await this.browser.newPage();
    if (this.cookies) {
      await this.page.setCookie(...this.cookies);
    }
    await this.page.setViewport(this.viewportArgs);
    this.response = await this.page.goto(this.data.url, this.navigationArgs);
    return this;
  }

  async closeBrowser() {
    try {
      await this.page.close();
      await this.browser.close();
    } catch (e) {
      console.log(`Cannot close instance`);
    }
  }
}

async function runner(req) {
  try {
    const scraper = new Scrapper(req);
    await scraper.init();

    const result = {};
    result.headers = await scraper.response.headers();

    if (result.headers["content-type"] === "application/json") {
      result.content = await scraper.response.json();
    } else {
      result.title = await scraper.page.title();
      result.content = await scraper.page.content();
    }
    await scraper.closeBrowser();
    return result;
  } catch (e) {
    return { error: "probably timeout" };
  }
}

module.exports = runner;
