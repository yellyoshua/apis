// @ts-check
import { chromium } from "playwright-chromium";
import request from "node-fetch";

const api = "";

export default async function (context, _) {
  const browser = await chromium.launch();

  const browserContext = await browser.newContext();
  const page = await browserContext.newPage();

  await page.goto("https://www.worldshottesttour.com");

  const ecuadorConcert = await page.textContent(
    '[event_label="Quito, Ecuador"]'
  );

  const isPreSale = ecuadorConcert.includes("PRE-SALE");
  const isOnSaleNow = ecuadorConcert.includes("ON SALE NOW!");
  const isOnSaleSoon = ecuadorConcert.includes("ON SALE SOON");

  const status = { isPreSale, isOnSaleNow, isOnSaleSoon };

  // @ts-ignore
  await request(api, {
    body: JSON.stringify({ isPreSale, isOnSaleNow, isOnSaleSoon }),
    method: "POST",
    compress: true,
  });

  context.res = {
    body: {
      status,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };

  await browser.close();
}
