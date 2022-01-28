// @ts-check
const { chromium } = require("playwright-chromium");

const accounts = [];

const tenSeconds = 10000;

/**
 *
 * @param {import("playwright-chromium").Page} page
 * @param {{ email: string, password: string }} account
 * @param {{ error: (error: string) => void, log: (message: string) => void, warning: (message: string) => void }} logger
 */
async function freeRollWithoutCaptcha(page, account, logger) {
  await page.click("a >> text=LOGIN");

  await page.fill("#login_form_btc_address", account.email);
  await page.fill("#login_form_password", account.password);

  await page.click("#login_button");

  await page.waitForTimeout(tenSeconds);

  logger.log("no thanks");

  const noThanksBTN = await page.$$(".pushpad_deny_button");
  noThanksBTN[0] && noThanksBTN[0].click();

  await page.waitForTimeout(tenSeconds);

  const disableCaptchaButton = await page.$$("#play_without_captchas_button");

  logger.log("disable captcha");
  disableCaptchaButton[0] && disableCaptchaButton[0].click();

  await page.waitForTimeout(tenSeconds);

  logger.log("play button");
  await page
    .click("#free_play_form_button", { timeout: 3000 })
    .catch((error) => logger.warning("play button timeout - ".concat(error)));

  await page.waitForTimeout(tenSeconds);
}

module.exports = async function (contextFn, _) {
  try {
    contextFn.log("It's running...");
    const browser = await chromium.launch();

    for (let account of accounts) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto("https://freebitco.in/signup/?op=s");
      await freeRollWithoutCaptcha(page, account, {
        log: (message) => contextFn.log(message),
        error: (message) => contextFn.log.error(message),
        warning: (message) => contextFn.log("Warning! - ".concat(message)),
      });

      await context.close();
    }

    await browser.close();

    contextFn.done(null, { myOutput: { text: "Done! End running..." } });
  } catch (error) {
    contextFn.log.error(error);
    contextFn.done([error], {
      myOutput: { text: "Execution error! - ".concat(error) },
    });
  }
};
