import { HoneygainController } from "./controllers";

async function asynchronousFunc() {
  try {
    const [API_TOKEN] = await Promise.all([SECRETS.get("API_TOKEN")]);

    const honeygainController = HoneygainController({
      endpoint: "https://dashboard.honeygain.com",
      token: API_TOKEN!,
    });

    const response = await honeygainController.claimRewards();
    const content = await response.json();
    console.log(content);
    return content;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

addEventListener("scheduled", (cronEvent) => {
  cronEvent.waitUntil(asynchronousFunc());
});
