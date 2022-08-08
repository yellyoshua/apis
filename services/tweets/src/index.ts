import * as Realm from 'realm-web';
import { routesSetup, NewHandler, newRealmClient } from "../../shared";

const getHeaderValue = (headers: Headers | Record<string, any>, headerKey: string) => {
  console.log('headers', headers);
  // @ts-ignore
  return headers.get ? headers.get(headerKey) : headers[headerKey];
}

const client = newRealmClient(Realm, {
  REALM_APP_ID: REALM_APP_ID,
  REALM_APP_API_KEY: REALM_APP_API_KEY
}).mongoClient('tweet-bot');

const handlerTweets: NewHandler = async (request, response) => {
  const tweets = await client.crud("tweets");
  const session = request.query.session;

  const tweetsList = await tweets.find(
    // @ts-ignore
    {session: Realm.BSON.ObjectId(session)},
    {sort: {created_at: -1}, limit: 100}
  );
  return response.json({response: tweetsList}, 200);
};

const handlerTwitterAuthorization: NewHandler = async (req, response) => {
  if (!hasAuthorization(getHeaderValue(req.headers, 'authorization'))) {
    return response.json({error: "Unauthorized"}, 401);
  }

  const {authorization, username} = req.data;
  if (!authorization || !username) {
    return response.json({error: "Missing authorization or username"}, 400);
  }
  const sessions = await client.crud("sessions");
  const session = await sessions.findOne({username});
  if (session) {
    sessions.update({username}, {authorization});
    const body = JSON.stringify({response: session._id});
    return response.json({body}, 200);
  }
  const newSession = await sessions.insert({authorization, username});
  return response.json({newSession}, 200);
}

const handlerNewTweet: NewHandler = async (req, response) => {
  if (!hasAuthorization(getHeaderValue(req.headers, 'authorization'))) {
    return response.json({error: "Unauthorized"}, 401);
  }

  const {session, content} = req.data;
  if (!session || !content) {
    return response.json({error: "Missing session or content"}, 400);
  }

  const sessions = await client.crud("sessions");
  // @ts-ignore
  const sessionData = await sessions.findOne({_id: Realm.BSON.ObjectID(session)});
  if (!sessionData) {
    return response.json({error: "Session not found"}, 404);
  }
  const tweets = await client.crud("tweets");
  const newTweet = await tweets.insert({
    session: sessionData._id,
    content,
  });
  const body = JSON.stringify({response: newTweet.insertedId});
  return response.json({body}, 200);
}

const handlerStatus: NewHandler = async (req, response) => {
  return response.json({response: "OK"}, 200);
}

addEventListener("fetch", routesSetup([
  { path: "/tweets", method: 'get', handler: handlerTweets },
  { path: "/twitter/authorization", method: 'post', handler: handlerTwitterAuthorization },
  { path: "/tweets", method: 'post', handler: handlerNewTweet },
  { path: "/status", method: 'get', handler: handlerStatus },
]));

function hasAuthorization(authorization: string | null): boolean {
  return authorization === API_KEY;
}
