import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { ExecutionEnvironment } from "@/types/executor";
import { exec } from "child_process";
import { waitFor } from "@/lib/helper/waitFor";

// const BROWSER_WS = "wss://username:password@brd.superproxy.io:9222";

const openDevTools = async (page: any, client: any) => {
  // get current frameId
  const frameId = page.mainFrame()._id;
  // get URL for devtoolsfrom scraping browser
  const { url: inspectUrl } = await client.send("Page.inspect", { frameId });
  // open devtools URL in local chrome >> macOSX
  exec(`open -a "Google Chrome" "${inspectUrl}"`, (error) => {
    if (error) throw new Error("Unable to open devtools: " + error)
  });

  await waitFor(5000)
}


export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>,
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    // const browser = await puppeteer.launch({
    //   headless: false, // for testing
    //   args: ["--proxy-server=brd.superproxy.io:33335"]
    // });

    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSER_WS
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 800 });
    await page.authenticate({
      username: "",
      password: "",
    })
    // const client = await page.createCDPSession();
    // await openDevTools(page, client);
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
