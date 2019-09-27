const store = new Map();
const logins = new Map();
const uuid = require('uuid/v4');

class Account {
  constructor(id, principalName, email, password, creationTime) {
    this.accountId = id;
    this.accountUuid = uuid();
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
        "bas:gg-legacy:agentCode": "NQJUEJCWT145",
        "bas:gg-legacy:agentFriendlyName": "Addams Agents",
        "bas:groupId": "9F9416A1-3977-4FC1-AB5E-0352417FD5A8",
        "profile": "https://www.ete.access.service.gov.uk/profile/svvrCUXlGWPIUPDcI08E20yGgDOgQK",
        "bas:groupProfile": "https://www.ete.access.service.gov.uk/groupprofile/svvrCUXlGWPIUPDcI08E20yGgDOgQK",
        "bas:gg-legacy:description": "This is the description for Gomez Addams"
    };
  }

  static findByLogin(id, password) {
    let account = logins.get(id + "-" + password)
    if (account != null) {
      account.lastLoginTime = Date.now();
      store.set(account.accountId, account);
      logins.set(account.accountId + "-" + password, this)
    }
    return Promise.resolve(account);
  }

  static async findById(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    return store.get(id);
  }
}

module.exports = Account;
