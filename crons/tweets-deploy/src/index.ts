import * as Realm from 'realm-web';
import _ from 'underscore';
import { newRealmClient } from "../../../shared";

export interface Env {
  REALM_APP_ID: string;
  REALM_APP_API_KEY: string;
  API_KEY: string;
  TWITTER_SERVICE_URL: string;
}

async function executeTweetsCron(client: any, env: Env, ctx: ExecutionContext) {
  const tweets = await client.crud("tweets");

  const tweetsData = await getTweets(tweets);

  for (const tweet of tweetsData) {
    const response = await postTweet(tweet, env);
    console.log(response);
    if (response.status === 200) {
      await tweets.update({_id: tweet.tweetId}, {posted: true, twitterId: response.id});
      console.log(`Tweet ${tweet.tweetId} posted!`);
    } else {
      console.log(`Error while trying to post tweet ${tweet.tweetId}`);
    }
  }
}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
    const client = newRealmClient(Realm, {
      REALM_APP_ID: env.REALM_APP_ID,
      REALM_APP_API_KEY: env.REALM_APP_API_KEY
    }).mongoClient('tweet-bot');

    ctx.waitUntil(executeTweetsCron(client, env, ctx));
	},
};

async function postTweet(tweet: {sessionId: string, tweetId: string}, env: Env) {
  const tweetServiceRequest = await fetch(env.TWITTER_SERVICE_URL +  'twitter-post-tweet', {
    method: 'POST',
    headers: {
      authorization: `${env.API_KEY}`,
    },
    body: JSON.stringify(tweet)
  });

  const data = await tweetServiceRequest.text();
  const response = safeJsonParse(data).response;
  return Object.assign(response, {status: tweetServiceRequest.status});
}

async function getTweets(tweets: any) {
  const tweetsData = await tweets.find(
    {posted: {$ne: true}},
    {sort: {_id: 1}, limit: 100}
  );
  const tweetsBySession = _(tweetsData).groupBy('session');

  return _(Object.entries(tweetsBySession)).map(([sessionId, tweets]) => {
    const tweet = _(tweets).first();
    return {tweetId: tweet._id, sessionId};
  });
}

export function safeJsonParse(str: any, def = {}) {
	try {
		return typeof str === 'string' ? JSON.parse(str) : {};
	} catch (error) {
		return def;
	}
}
