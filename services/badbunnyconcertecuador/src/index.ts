import { Router, createResponse } from "../../shared";

const concertStatusKey = "bad-bu";

export const handlerUpdateConcertStatus = async (request: any, headers: any) => {
  const content = await request.json();

  const { isPreSale, isOnSaleNow, isOnSaleSoon } = content || {};

  await BadbunnyConcertEcuador.put(
    concertStatusKey,
    JSON.stringify({
      isPreSale,
      isOnSaleNow,
      isOnSaleSoon,
    })
  );

  return createResponse({
    body: null,
    response: { headers, status: 201 },
  });
};

export const handlerConcertStatus = async (_: any, headers: any) => {
  const content = await BadbunnyConcertEcuador.get<Record<string, any>>(concertStatusKey, "json");
  const {
    isPreSale = false,
    isOnSaleNow = false,
    isOnSaleSoon = false
  } = content || {};

  return createResponse({
    body: JSON.stringify({ isPreSale, isOnSaleNow, isOnSaleSoon }),
    response: { headers, status: 200 },
  });
};


// @ts-ignore
if (globalThis.addEventListener) {
  addEventListener("fetch", (event) => {
    const router = new Router(event);

    router.POST("/update", handlerUpdateConcertStatus);
    router.GET("/status", handlerConcertStatus);

    router.serve();
  });
}
