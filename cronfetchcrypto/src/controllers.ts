import { GraphQLClient, ApiCredentials } from "./api/config";
import { gql } from "./utils/gql";

export class ApiController {
  private api: { headers: Headers; uri: string };
  constructor(crendentials: ApiCredentials) {
    this.api = GraphQLClient(crendentials);
  }

  activeSuperBoost() {
    const query = gql`
      mutation {
        boost(platform: BrowserAndroid, ratio: 2) {
          ts
          start_time
          duration
          ratio
          license_id
        }
      }
    `.join("");

    return this.makeRequest(query);
  }

  mine() {
    const query = gql`
      mutation MiningStats {
        android {
          mining_stats(
            stats: {
              boot_ts: 1641543983
              ts: 1641543983
              hashes: 29385
              hps: 489.76095335257816
              visible_hps: 1140.711
              cores: 8
            }
          ) {
            code
            cmd
          }
        }
      }
    `.join("");

    return this.makeRequest(query);
  }

  makeRequest(query: string) {
    const { headers, uri } = this.api;

    return fetch(uri, {
      headers,
      body: JSON.stringify({ query }),
      method: "POST",
    });
  }
}
