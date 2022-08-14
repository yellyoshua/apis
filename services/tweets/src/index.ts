import * as Realm from 'realm-web';
import { routesSetup, NewHandler, newRealmClient } from "../../shared";
import { Client, auth} from 'twitter-api-sdk';

const authClient = new auth.OAuth2User({
  client_id: TWITTER_CLIENT_ID,
  client_secret: TWITTER_CLIENT_SECRET,
  callback: TWITTER_AUTHORIZATION_CALLBACK,
  scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
});

const twitterClient = new Client(authClient);
const twitterClientState = 'twitterClientState';
const twitterClientCodeChallenge = 'a543d136-2cc0-4651-b571-e972bf116550';
const twitterAppCallback = 'https://tweets.devenvironment.me/';

const client = newRealmClient(Realm, {
  REALM_APP_ID: REALM_APP_ID,
  REALM_APP_API_KEY: REALM_APP_API_KEY
}).mongoClient('tweet-bot');

const handlerTweets: NewHandler = async (request, response) => {
  const tweets = await client.crud("tweets");
  const session = request.query?.session;

  const tweetsList = await tweets.find(
    // @ts-ignore
    {session: Realm.BSON.ObjectId(session)},
    {sort: {_id: 1}, limit: 100}
  );
  return response.json({response: tweetsList}, 200);
};

const handlerNewTweet: NewHandler = async (req, response) => {
  if (!hasAuthorization(getHeaderValue(req.headers, 'authorization'))) {
    return response.json({error: "Unauthorized"}, 401);
  }

  const {session, content, _id: tweetId} = req.data;
  if (!session || !content) {
    return response.json({error: "Missing session or content"}, 400);
  }

  const [sessions, tweets] = await Promise.all([
    client.crud("sessions"),
    client.crud("tweets")
  ]);

  const [sessionData, canUpdateTweet] = await Promise.all([
    // @ts-ignore
    sessions.findOne({_id: Realm.BSON.ObjectID(session)}),
    // @ts-ignore
    tweets.findOne({_id: Realm.BSON.ObjectID(tweetId), posted: {$ne: true}})
  ]);

  if (!sessionData) {
    return response.json({error: "Session not found"}, 404);
  }

  if (canUpdateTweet) {
    // @ts-ignore
    const newTweet = await tweets.update({_id: Realm.BSON.ObjectID(tweetId)}, {
      content: content
    });

    return response.json(newTweet, 200);
  }

  const newTweet = await tweets.insert({
    session: sessionData._id,
    content,
  });

  return response.json(newTweet, 200);
}

const handlerTwitterAuthorizationCallback: NewHandler = async (req, response) => {
  try {
    const { state, code } = req.query || {};
    if (state !== twitterClientState) {
      return response.json({error: "Invalid state"}, 400);
    }

    const sessions = await client.crud("sessions");

    authClient.generateAuthURL({
      state: twitterClientState,
      code_challenge_method: 'plain',
      code_challenge: twitterClientCodeChallenge
    });

    const {token} = await authClient.requestAccessToken(code as string);

    const twitter = await twitterClient.users.findMyUser({
      "user.fields": ["username", "profile_image_url"]
    });
    const username = twitter.data?.username;
    const session = await sessions.findOne({username});
    const newSessionData = {
      profile_image_url: twitter.data?.profile_image_url || null,
      token_type: token.token_type,
      scope: token.scope,
      refresh_token: token.refresh_token,
      expires_at: token.expires_at,
    };

    if (session) {
      await sessions.update({username}, newSessionData);
    } else {
      await sessions.insert(Object.assign({username}, newSessionData));
    }

    const newSession = await sessions.findOne({username});

    const url = new URL(twitterAppCallback);
    url.searchParams.set('session', safeToString(newSession._id));
    return response.redirect(url.toString());
  } catch (error) {
    console.log(error);
    return response.json({errors: ['Error while trying to get access token']}, 400);
  }
};

const handlerNewTwitterAuthorization: NewHandler = async (req, response) => {
  try {
    const authUrl = authClient.generateAuthURL({
      state: twitterClientState,
      code_challenge_method: "plain",
      code_challenge: twitterClientCodeChallenge
    });

    return response.redirect(authUrl, 301);
  } catch (error) {
    console.log(error);
    return response.json({errors: ['Error generating authorization url']}, 400);
  }
};

const handlerTwitterPostTweet: NewHandler = async (req, response) => {
  try {
    if (!hasAuthorization(getHeaderValue(req.headers, 'authorization'))) {
      return response.json({error: "Unauthorized"}, 401);
    }

    const {sessionId, tweetId} = req.data;
    if (!sessionId || !tweetId) {
      return response.json({error: "Missing session or content"}, 400);
    }

    const [sessions, tweets] = await Promise.all([
      client.crud("sessions"),
      client.crud("tweets"),
    ]);

    const [sessionData, tweetData] = await Promise.all([
      // @ts-ignore
      sessions.findOne({_id: Realm.BSON.ObjectID(sessionId)}),
      // @ts-ignore
      tweets.findOne({_id: Realm.BSON.ObjectID(tweetId)}),
    ]);

    if (!sessionData) {
      return response.json({errors: ["Session not found"]}, 404);
    }

    if (!tweetData) {
      return response.json({errors: ["Tweet not found"]}, 404);
    }

    const tokenData: TokenData = {
      token_type: sessionData.token_type,
      access_token: sessionData.access_token,
      scope: sessionData.scope,
      refresh_token: sessionData.refresh_token,
      expires_at: sessionData.expires_at,
    };

    const newSessionData = await refreshTwitterAccessToken(tokenData);

    await sessions.update({username: sessionData.username}, newSessionData);

    const {data} = await twitterClient.tweets.createTweet({
      text: tweetData.content,
    });

    return response.json({response: data}, 200);
  } catch (error) {
    console.log(error);
    return response.json({errors: ['Error while trying to post tweet']}, 400);
  }
}

const handlerTwitterSession: NewHandler = async (req, response) => {
  try {
    if (!hasAuthorization(getHeaderValue(req.headers, 'authorization'))) {
      return response.json({error: "Unauthorized"}, 401);
    }

    const sessions = await client.crud("sessions");
    const sessionId = req.query.session;
    // @ts-ignore
    const sessionData = await sessions.findOne({_id: Realm.BSON.ObjectID(sessionId)});

    if (!sessionData) {
      return response.json({errors: ["Session not found"]}, 404);
    }

    const session = {
      _id: sessionData._id,
      username: sessionData.username,
      profile_image_url: sessionData.profile_image_url,
    };

    return response.json({response: session}, 200);
  } catch (error) {
    console.log(error);
    return response.json({errors: ['Error while trying to get session']}, 400);
  }
};

const handlerStatus: NewHandler = async (req, response) => {
  return response.json({response: "OK"}, 200);
}

addEventListener("fetch", routesSetup([
  { path: "/twitter-authorization", method: 'get', handler: handlerNewTwitterAuthorization },
  { path: "/twitter-authorization-callback", method: 'get', handler: handlerTwitterAuthorizationCallback },
  { path: "/twitter-post-tweet", method: 'post', handler: handlerTwitterPostTweet },
  { path: "/twitter-session", method: 'get', handler: handlerTwitterSession },
  { path: "/tweets", method: 'get', handler: handlerTweets },
  { path: "/tweets", method: 'post', handler: handlerNewTweet },
  { path: "/status", method: 'get', handler: handlerStatus },
]));

function hasAuthorization(authorization: string | null): boolean {
  return authorization === API_KEY;
}

function getHeaderValue(headers: Headers | Record<string, any>, headerKey: string) {
  // @ts-ignore
  return headers.get ? headers.get(headerKey) : headers[headerKey];
}

async function refreshTwitterAccessToken(tokenData: TokenData) {
  // @ts-ignore
  authClient.token = tokenData;
  const {token} = await authClient.refreshAccessToken();
  return token;
}

function safeToString(data: any): string {
  if (!data) {
    return "";
  }

  return data.toString ? data.toString() : data;
}

interface TokenData {
  token_type: string;
  scope: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
}
