import { HoneygainController } from "./controllers";

// TODO: Handle more than one token at a time

async function asynchronousFunc() {
  try {
    const honeygainController = HoneygainController({
      endpoint: "https://dashboard.honeygain.com",
      token: API_TOKEN,
    });

    const response = await honeygainController.claimRewards();
    const content = await response.json();
    console.log(content);
    return content;
  } catch (error) {
    console.error({ error });
    return { error };
  }
}

addEventListener("scheduled", (cronEvent) => {
  cronEvent.waitUntil(asynchronousFunc());
});
