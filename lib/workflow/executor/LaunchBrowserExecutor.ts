import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { ExecutionEnvironment } from "@/types/executor";

const BROWSER_WS = "wss://brd-customer-hl_1366562d-zone-scrape_flow_browser:xjjvq3kesv6k@brd.superproxy.io:9222";


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
    // await page.authenticate({
    //   username: "",
    //   password: "",
    // })
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
