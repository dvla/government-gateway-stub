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
      - CLIENT_REDIRECT_URI=https://prs-shop-dev.squad3.ac.dvla.gov.uk
      - CLIENT_LOGOUT_REDIRECT_URI=https://prs-shop-dev.squad3.ac.dvla.gov.uk/logout
```

## Example
According SCP documentation from: https://gitlab.com/business-authentication-service/documentation/wikis/Authorisation

```
AUTH

http://localhost:9090/auth
?client_id=stubOidcClient
&redirect_uri=http://localhost:9090/callback
&scope=openid
&response_type=code
&state=a08bbf629d35b5329880fd6ec24064115e18bf06

RESPONSE
http://localhost:9090/callback?code=MDlkZTdmMGQtYzA4Mi00MzQ2LTgxM2YtMjMwZDRmMTYwMzVk6IaRX7sgrG49WMe1ZeEKSFS6tjUmN5t8AGJIwIBrIlAOulrbpQxSkO-JlNtjWxQ3FoZc2c_vo62NpWG355z5zg&state=a08bbf629d35b5329880fd6ec24064115e18bf06&session_state=9976abb20c79257f23a3b346ebd3168a7f227aaabe3bde2bebd906dfb5bff245.96be0038d3057052
```