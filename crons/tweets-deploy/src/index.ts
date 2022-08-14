import * as Realm from 'realm-web';
import _ from 'underscore';
import { newRealmClient } from "../../../shared";

export interface Env {
  REALM_APP_ID: string;
  REALM_APP_API_KEY: string;
  API_KEY: string;
}

async function executeTweetsCron(client: any, env: Env, ctx: ExecutionContext) {
  const tweets = await client.crud("tweets");
  const sessions = await client.crud("sessions");
  const tweetsData = await getTweets(tweets, sessions);

  for (const tweet of tweetsData) {
    const response = await postTweet(tweet, env, ctx);
    console.log(response);
    await tweets.update({_id: tweet.tweetId}, {posted: true});
    console.log(`Tweet ${tweet.tweetId} posted!`);
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

async function postTweet(tweet: {sessionId: string, tweetId: string}, env: Env, ctx: ExecutionContext) {
  const tweetServiceRequest = new Request('/twitter-post-tweet', {
    method: 'POST',
    headers: {
      authorization: `${env.API_KEY}`,
    },
    body: JSON.stringify(tweet)
  })
  // @ts-ignore
  return Promise.resolve(env.tweets.fetch(tweetServiceRequest, env, ctx));
}

async function getTweets(tweets: any, sessions: any) {
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
