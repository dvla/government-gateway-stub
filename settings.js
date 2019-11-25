module.exports.config = {
  cookies: {
    long: { signed: true, maxAge: 1 },//(1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true },
    keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
  },
  acrValues: ['Level4', 'Level3'],
  claims: {
	openid: {
		sub: null,
		iss: null,
		acr: null,
		amr: null,
		auth_time: null,
		pid: null,
		locale: null,
		jti: null,
		sid: null,
		name: null,
		email: null,
		email_verified: null,
		"bas:roles": null,
		"bas:userInfoVersion": null,
		"bas:transition:lastLoginTime": null,
		"bas:transition:credentialCreatedDate": null,
		"bas:gg-legacy:registrationCategory": null,
		"bas:gg-legacy:agentId": null,
		"bas:gg-legacy:agentCode": null,
		"bas:gg-legacy:agentFriendlyName": null,
		"bas:groupId": null,
		"profile": null,
		"bas:groupProfile": null,
		"bas:gg-legacy:description":null
	},
  },
  features: {
    devInteractions: false, // defaults to true
    discovery: true, // defaults to true
    // requestUri: true, // defaults to true
    // oauthNativeApps: true, // defaults to true
    // pkce: true, // defaults to true

    backchannelLogout: true, // defaults to false
    claimsParameter: true, // defaults to false
    encryption: false, // defaults to false
    frontchannelLogout: true, // defaults to false
    introspection: false, // defaults to false
    registration: true, // defaults to false
    request: true, // defaults to false
    revocation: false, // defaults to false
    sessionManagement: true, // defaults to false
  },
  subjectTypes: ['public', 'pairwise'],
  pairwiseSalt: 'da1c442b365b563dfc121f285a11eedee5bbff7110d55c88',
  interactionUrl: function interactionUrl(ctx, interaction) { // eslint-disable-line no-unused-vars
    return `/interaction/${ctx.oidc.uuid}`;
  },
  clientCacheDuration: 1 * 24 * 60 * 60, // 1 day in seconds,
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    ClientCredentials: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  },
  unsupported : { 
	  idTokenSigningAlgValues: ["none",
	                            "HS256",
	                            "HS384",
	                            "HS512",
	                            "RS384",
	                            "RS512",
	                            "PS256",
	                            "PS384",
	                            "PS512"],
	  requestObjectSigningAlgValues: ["none",
	                                  "HS256",
	                                  "HS384",
	                                  "HS512",
	                                  "RS256",
	                                  "RS384",
	                                  "RS512",
	                                  "PS256",
	                                  "PS384",
	                                  "PS512",
	                                  "ES256",
	                                  "ES384",
	                                  "ES512"],
	  tokenEndpointAuthSigningAlgValues: ["HS256",
	                                      "HS384",
	                                      "HS512",
	                                      "RS384",
	                                      "RS512",
	                                      "PS256",
	                                      "PS384",
	                                      "PS512",
	                                      "ES256",
	                                      "ES384",
	                                      "ES512"],
	  revocationEndpointAuthSigningAlgValues: ["HS256",
	                                           "HS384",
	                                           "HS512",
	                                           "RS256",
	                                           "RS384",
	                                           "RS512",
	                                           "PS256",
	                                           "PS384",
	                                           "PS512",
	                                           "ES256",
	                                           "ES384",
	                                           "ES512"],
	  userinfoSigningAlgValues: ["none",
	                             "HS256",
	                             "HS384",
	                             "HS512",
	                             "RS256",
	                             "RS384",
	                             "RS512",
	                             "PS256",
	                             "PS384",
	                             "PS512"] },
	 
};

// Parse return urls
var callbackUris = [];
if(process.env.AUTH_CALLBACKS){
	callbackUris = process.env.AUTH_CALLBACKS.split(',').map(x => x.trim());
}
console.log("Return URLs: ", callbackUris);

module.exports.clients = [
{
    client_id: 'test_implicit_app',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://implicit-flow.com'],
    token_endpoint_auth_method: 'none'
},
{
	client_id: process.env.STUB_CLIENT_ID || 'stubOidcClient',
	client_secret: process.env.STUB_CLIENT_SECRET || 'secretsarehardtokeep',
	grant_types: ['refresh_token', 'authorization_code'],
	redirect_uris: callbackUris,
	id_token_signed_response_alg: 'RS256', 
	response_types: [
		'code'
	],
	token_endpoint_auth_method: 'client_secret_basic'
}];

module.exports.certificates = [{
	  d: 'VEZOsY07JTFzGTqv6cC2Y32vsfChind2I_TTuvV225_-0zrSej3XLRg8iE_u0-3GSgiGi4WImmTwmEgLo4Qp3uEcxCYbt4NMJC7fwT2i3dfRZjtZ4yJwFl0SIj8TgfQ8ptwZbFZUlcHGXZIr4nL8GXyQT0CK8wy4COfmymHrrUoyfZA154ql_OsoiupSUCRcKVvZj2JHL2KILsq_sh_l7g2dqAN8D7jYfJ58MkqlknBMa2-zi5I0-1JUOwztVNml_zGrp27UbEU60RqV3GHjoqwI6m01U7K0a8Q_SQAKYGqgepbAYOA-P4_TLl5KC4-WWBZu_rVfwgSENwWNEhw8oQ',
	  dp: 'E1Y-SN4bQqX7kP-bNgZ_gEv-pixJ5F_EGocHKfS56jtzRqQdTurrk4jIVpI-ZITA88lWAHxjD-OaoJUh9Jupd_lwD5Si80PyVxOMI2xaGQiF0lbKJfD38Sh8frRpgelZVaK_gm834B6SLfxKdNsP04DsJqGKktODF_fZeaGFPH0',
	  dq: 'F90JPxevQYOlAgEH0TUt1-3_hyxY6cfPRU2HQBaahyWrtCWpaOzenKZnvGFZdg-BuLVKjCchq3G_70OLE-XDP_ol0UTJmDTT-WyuJQdEMpt_WFF9yJGoeIu8yohfeLatU-67ukjghJ0s9CBzNE_LrGEV6Cup3FXywpSYZAV3iqc',
	  e: 'AQAB',
	  kty: 'RSA',
	  kid: 'do-not-use-in-production', 
	  n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ',
	  p: '5wC6nY6Ev5FqcLPCqn9fC6R9KUuBej6NaAVOKW7GXiOJAq2WrileGKfMc9kIny20zW3uWkRLm-O-3Yzze1zFpxmqvsvCxZ5ERVZ6leiNXSu3tez71ZZwp0O9gys4knjrI-9w46l_vFuRtjL6XEeFfHEZFaNJpz-lcnb3w0okrbM',
	  q: '3I1qeEDslZFB8iNfpKAdWtz_Wzm6-jayT_V6aIvhvMj5mnU-Xpj75zLPQSGa9wunMlOoZW9w1wDO1FVuDhwzeOJaTm-Ds0MezeC4U6nVGyyDHb4CUA3ml2tzt4yLrqGYMT7XbADSvuWYADHw79OFjEi4T3s3tJymhaBvy1ulv8M',
	  qi: 'wSbXte9PcPtr788e713KHQ4waE26CzoXx-JNOgN0iqJMN6C4_XJEX-cSvCZDf4rh7xpXN6SGLVd5ibIyDJi7bbi5EQ5AXjazPbLBjRthcGXsIuZ3AtQyR0CEWNSdM7EyM5TRdyZQ9kftfz9nI03guW3iKKASETqX2vh0Z8XRjyU',
	  use: 'sig',
	}
];
