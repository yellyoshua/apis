import { nanoid as createToken } from "nanoid";
import { KEY_AUTHORIZATION_HEADER } from "../constants";
import { AuthModel } from "../interface";
import { checkKVBeCreated } from "../utils";

export class AuthController {
  private request: Request;

  constructor(request: Request) {
    const KVCreated = checkKVBeCreated();
    if (!KVCreated)
      throw new Error(`create AUTH_TOKENS (KV) for this instance. \n
      Run the following command:\n wrangler kv:namespace create "AUTH_TOKENS"`);

    this.request = request;
  }

  async isAuthenticated(): Promise<boolean> {
    const authenticated = await SimpleAuthController.checkAuthentication(
      this.request
    );
    return authenticated;
  }

  master = () => new AuthMasterController(this.request);

  async createAuthentication(): Promise<string | null> {
    try {
      const authenticated = this.isAuthenticated();
      if (!authenticated) return null;

      const authorization = await SimpleAuthController.createAuthentication();
      return authorization;
    } catch (error) {
      return null;
    }
  }
}

export class AuthMasterController {
  private request: Request;

  constructor(request: Request) {
    const KVCreated = checkKVBeCreated();
    if (!KVCreated)
      throw new Error(`create AUTH_TOKENS (KV) for this instance. \n
      Run the following command:\n wrangler kv:namespace create "AUTH_TOKENS"`);
    this.request = request;
  }

  async isAuthenticated(): Promise<boolean> {
    const authenticated = await SimpleAuthController.checkAuthentication(
      this.request
    );
    return authenticated;
  }

  async createAuthentication(): Promise<string | null> {
    try {
      const authenticated = this.isAuthenticated();
      if (!authenticated) return null;

      const authorization = await SimpleAuthController.createAuthentication();
      return authorization;
    } catch (error) {
      return null;
    }
  }
}

class SimpleAuthController {
  static async checkAuthentication(request: Request): Promise<boolean> {
    const authorization = request.headers.get(KEY_AUTHORIZATION_HEADER);

    if (!authorization) return false;

    const auth = await AUTH_TOKENS.get<AuthModel>(authorization, "json");

    if (!auth) return false;
    if (auth.authorization !== authorization) return false;

    return true;
  }

  static async createAuthentication(
    expirationTtl?: number
  ): Promise<string | null> {
    try {
      const token = createToken(30);

      const auth: AuthModel = {
        authorization: expirationTtl ? token : `master-${token}`,
      };

      await AUTH_TOKENS.put(token, JSON.stringify(auth), {
        expirationTtl,
      });

      return token;
    } catch (error) {
      return null;
    }
  }
}
