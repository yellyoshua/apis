import { Handler, createResponse } from "repo-packages-route";
const concertStatusKey = "bad-bu";

export const handlerUpdateConcertStatus: Handler = async (request, headers) => {
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

export const handlerConcertStatus: Handler = async (_, headers) => {
  const content = await BadbunnyConcertEcuador.get<{
    isPreSale: boolean;
    isOnSaleNow: boolean;
    isOnSaleSoon: boolean;
  }>(concertStatusKey, "json");

  if (content) {
    const { isPreSale, isOnSaleNow, isOnSaleSoon } = content || {};

    return createResponse({
      body: JSON.stringify({ isPreSale, isOnSaleNow, isOnSaleSoon }),
      response: { headers, status: 200 },
    });
  } else {
    return createResponse({
      body: JSON.stringify({
        isPreSale: false,
        isOnSaleNow: false,
        isOnSaleSoon: true,
      }),
      response: { headers, status: 200 },
    });
  }
};
