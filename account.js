const store = new Map();
const logins = new Map();
const uuid = require('uuid/v4');
const os = require("os");
const hostname = os.hostname();

class Account {
  constructor(id, principalName, email, password, creationTime, identifier = uuid()) {
    this.accountId = id;
    this.accountUuid = identifier;
    this.principalName = principalName;
    this.email = email;
    this.creationTime = creationTime;
    this.lastLoginTime = creationTime;
    store.set(this.accountId, this);
    logins.set(this.accountId + "-" + password, this)
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope) { // eslint-disable-line no-unused-vars
    return {
        sub: this.accountId,
        pid: this.accountUuid,
        email: this.email,
        email_verified: true,
        name: this.principalName,
        locale: 'en',
        "bas:roles": [ "Administrator", "User" ],
        jti: this.principalName + ':' + this.accountUuid,
        "bas:userInfoVersion": "1.1",
        "bas:transition:lastLoginTime": this.lastLoginTime,
        "bas:transition:credentialCreatedDate": this.creationTime,
        "bas:gg-legacy:registrationCategory": "Agent",
        "bas:gg-legacy:agentId": "An agent ID",
        "bas:gg-legacy:agentCode": "RANDOM12345",
        "bas:gg-legacy:agentFriendlyName": "Test Friendly Name",
        "bas:groupId": "9F9416A1-3977-4FC1-AB5E-0352417FD5A8",
        "profile": hostname + "/account/your-details/ayp/tbf/" + this.accountUuid,
        "bas:groupProfile": "somelink",
        "bas:gg-legacy:description": "This is the description for the test user name"
    };
  }

  static findByLogin(id, password) {
    let account = logins.get(id + "-" + password);
    if (account != null) {
      account.lastLoginTime = Date.now();
      store.set(account.accountId, account);
      logins.set(account.accountId + "-" + password, account);
    }
    return Promise.resolve(account);
  }

  static async findById(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context

    return store.get(parseInt(id));
  }
  static async findByUuid(uuid) {
    const arr = Array.from(store.values());
    return arr.filter((e) => e.accountUuid === uuid)[0];
  }
}

module.exports = Account;
