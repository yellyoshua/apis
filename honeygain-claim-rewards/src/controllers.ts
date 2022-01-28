import { createHeaders } from "./utils/headers";

interface HoneygainControllerArgs {
  endpoint: string;
  token: string;
}

export const HoneygainController = ({
  endpoint,
  token,
}: HoneygainControllerArgs) => {
  const claimRewardsEndpoint = `${endpoint}/api/v1/contest_winnings`;
  const authorization = `Bearer ${token}`;

  const claimRewards = () => {
    const headers = createHeaders([
      ["accept", "application/json, text/plain, */*"],
      ["accept-language", "en-US,en;q=0.9"],
      ["authority", "dashboard.honeygain.com"],
      ["content-length", "0"],
      ["authorization", authorization],
    ]);

    return fetch(claimRewardsEndpoint, {
      headers,
      referrer: "https://dashboard.honeygain.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "POST",
    });
  };

  return { claimRewards };
};
