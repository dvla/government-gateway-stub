# Government Gateway Stub
A simple OpenID Connect identity provider with stubbed login (i.e. accepts all logins). Based on the great NodeJS module oidc-provider.
The CODE returned from the provider mimics the CODE from Government Gateway, with the obvious exception of the signing key and issuer values.

Please note that this should only be used in test or local environments as the keys used to sign the token are readily available here in the source code.


## Usage
`docker-compose build`
`docker-compose up`

With the following configurable ENVIROMENT VARIABLES
```
      - PORT=9090
      - CLIENT_ID=my-client
      - CLIENT_SECRET=my-secret
      - CLIENT_REDIRECT_URI=http://localhost:8080/cb
      - CLIENT_LOGOUT_REDIRECT_URI=http://localhost:8080
```

## Example
http://localhost:9090/auth?client_id=s6BhdRkqt3&redirect_uri=http://localhost:3000&response_type=code&scope=openid


According SCP documentation from: https://gitlab.com/business-authentication-service/documentation/wikis/Authorisation
```
GET <issuer>/authorize?    
response_type=code    
scope=openid    
client_id=s6BhdRkqt3    
state=af0ifjsldkj    
redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb 
```