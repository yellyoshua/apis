import * as Realm from 'realm-web';
import _ from 'underscore';
import { newRealmClient } from "../../../shared";

const client = newRealmClient(Realm, {
  REALM_APP_ID: REALM_APP_ID,
  REALM_APP_API_KEY: REALM_APP_API_KEY
}).mongoClient('tweet-bot');

export interface Env {}

async function getTweets(collection: any) {
  const tweets = await collection.find(
    {posted: {$ne: true}},
    {sort: {created_at: -1}, limit: 100}
  );

  const sessionIds = _(tweets).pluck('session');
  const sessions = await client.crud("sessions");
  const sessionsData = await sessions.find({_id: {$in: sessionIds}});
  const sessionsMap = _(sessionsData).indexBy('_id');

  return _(tweets).map(tweet => {
    const {authorization} = sessionsMap[tweet.session];
    return {tweet: tweet._id, content: tweet.content, authorization};
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

async function executeTweetsCron() {
  const collection = await client.crud("tweets");
  const tweets = await getTweets(collection);

  for (const tweet of tweets) {
    const {authorization, content} = tweet;
    const response = await sendTweet(authorization, content);
    console.log(response);
    await collection.update({_id: tweet.tweet}, {posted: true});
    console.log(`Tweet ${tweet.tweet} posted!`);
  }
}

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
    ctx.waitUntil(executeTweetsCron());
	},
};
