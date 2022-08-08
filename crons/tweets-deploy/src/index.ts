import * as Realm from 'realm-web';
import _ from 'underscore';
import { newRealmClient } from "../../../shared";

export interface Env {
  REALM_APP_ID: string;
  REALM_APP_API_KEY: string;
}

async function getTweets(tweets: any, sessions: any) {
  const tweetsData = await tweets.find(
    {posted: {$ne: true}},
    {sort: {_id: 1}, limit: 100}
  );

  const tweetsBySession = _(tweetsData).groupBy('session');
  const sessionIds = _(tweetsData).pluck('session');

  const sessionsData = await sessions.find({_id: {$in: sessionIds}});
  const sessionsById = _(sessionsData).indexBy('_id');

  return _(Object.entries(tweetsBySession)).map(([sessionId, tweets]) => {
    const tweet = _(tweets).first();
    const {authorization} = sessionsById[sessionId];

    return {tweet: tweet._id, authorization, content: tweet.content};
  });
}

async function sendTweet(authorization: string, content: string) {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    },
    body: JSON.stringify({
      text: content,
    })
  });

  return response.json();
}

async function executeTweetsCron(client: any) {
  const tweets = await client.crud("tweets");
  const sessions = await client.crud("sessions");
  const tweetsData = await getTweets(tweets, sessions);

  for (const tweet of tweetsData) {
    const {tweet: tweetId, authorization, content} = tweet;
    const response = await sendTweet(authorization, content);
    console.log(response);
    await tweets.update({_id: tweetId}, {posted: true});
    console.log(`Tweet ${tweet.tweet} posted!`);
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

    ctx.waitUntil(executeTweetsCron(client));
	},
};
