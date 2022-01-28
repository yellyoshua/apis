export interface ApiCredentials {
  token: string;
  xCtSign: string;
  xCtTs: string;
}

const uri = "https://api.cryptobrowser.site/graphql";

export const GraphQLClient = ({ token, xCtSign, xCtTs }: ApiCredentials) => {
  const headers = new Headers();

  const headerContent = [
    ["accept", "*/*"],
    ["accept-language", "en-US,en;q=0.9"],
    ["authorization", `Bearer ${token}`],
    ["cache-control", "no-cache"],
    ["content-type", "application/json"],
    ["pragma", "no-cache"],
    ["sec-fetch-dest", "empty"],
    ["sec-fetch-mode", "cors"],
    ["sec-fetch-site", "cross-site"],
    ["x-ct-sign", xCtSign],
    ["x-ct-ts", xCtTs],
  ];

  for (let header in headerContent) {
    const [key, value] = header;
    headers.set(key, value);
  }

  return { headers, uri };
};
