interface RealmCredentials {
  REALM_APP_ID: string
  REALM_APP_API_KEY: string
}

function crud(db: any, collectionName: string) {
  const collection = db.collection(collectionName);
  return {
    async find<T = any>(query: Record<string, any>): Promise<T[]> {
      return collection.find(query);
    },
    async findOne<T = any>(query: Record<string, any>): Promise<T> {
      return collection.findOne(query);
    },
    async insert(doc: Record<string, any>) {
      return collection.insertOne(doc);
    },
    async update(query: Record<string, any>, doc: Record<string, any>) {
      return collection.updateOne(query, doc);
    },
    async delete(_id: string) {
      return collection.deleteOne({_id});
    }
  };
}

export function newRealmClient(Realm: any, credentials: RealmCredentials) {
  const {REALM_APP_API_KEY, REALM_APP_ID} = credentials;
  const app = new Realm.App({ id: REALM_APP_ID});
  const creentials = Realm.Credentials.apiKey(REALM_APP_API_KEY);

  const mongoClient = (database: string) => {
    return {
      async crud(collectionName: string) {
        const user = await app.logIn(creentials);

        const client = user.mongoClient('mongodb-atlas');
        const db = client.db(database);


        return crud(db, collectionName);
      }
    };
  };

  return {mongoClient};
}

