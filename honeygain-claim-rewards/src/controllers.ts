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
    const headers = {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization,
      "sec-gpc": "1",
    };

    return fetch(claimRewardsEndpoint, {
      headers,
      body: null,
      method: "POST",
    });
  };

  return { claimRewards };
};
