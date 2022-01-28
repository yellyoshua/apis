import { ApiController } from "./controllers";

const apiController = new ApiController({
  token:
    "gAAAAABh1_kvn84Ci2mtgDXyBJQ_6DHf1ThT_cdSMTe7WlfZOgLLtQfTLu5065Ztl6MVx8dKYqA0VnomaxVYaE6U5bOaxTZSsw==",
  xCtSign:
    "QBEkUYzGhO7Wh8aFXl9CIgvYK5H/Md7yPe7IOYYZF8wMjb6F4XbbW0zYCp9JKJ+njIVZjsu/BIuVAU8/",
  xCtTs: "1641544324",
});

async function asynchronousFunc() {
  await apiController.activeSuperBoost();
  console.log("activate super boost");

  await apiController.mine();
  console.log("mining");
}

addEventListener("scheduled", (cronEvent) => {
  cronEvent.waitUntil(asynchronousFunc());
});
