const store = new Map();
const logins = new Map();
const uuid = require('uuid/v4');

class Account {
  constructor(id, principalName, email, password) {
    this.accountId = id;
    this.accountUuid = uuid();
    this.principalName = principalName;
    this.email = email;
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
        'bas:roles': [ "Administrator", "User" ],
        jti: this.principalName + ':' + this.accountUuid,
    };
  }

  static findByLogin(id, password) {
    return Promise.resolve(logins.get(id + "-" + password));
  }

  static async findById(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    return store.get(id);
  }
}

module.exports = Account;
