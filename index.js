/* eslint-disable no-console */

const Provider = require('oidc-provider');
const path = require('path');
const { set } = require('lodash');
const bodyParser = require('koa-body');
const querystring = require('querystring');
const Router = require('koa-router');
const render = require('koa-ejs');
const serve  = require('koa-static');
const Account = require('./account');
const { config, clients, certificates} = require('./settings');

const port = process.env.PORT || 9090;
const issuer = process.env.ISSUER || 'https://localhost:9090';

//AAD specific header, can only be set by azure when running as AppService
const PRINCIPAL_NAME_HEADER = 'x-ms-client-principal-name';
const DOMAIN_HINT = process.env.DOMAIN_HINT || 'nav.no';
const DEBUG_REQUEST = process.env.DEBUG_REQUEST || true;
const WEBSITE_AUTH_ENABLED = process.env['WEBSITE_AUTH_ENABLED'] === 'True' || true


config.findById = Account.findById;

const provider = new Provider(issuer, config);
provider.defaultHttpOptions = { timeout: 15000 };

function enforceAuthenticationIfEnabled(ctx){
	if(WEBSITE_AUTH_ENABLED){
		console.log('Authentication is enabled for site, check required headers');
		if (!ctx.get(PRINCIPAL_NAME_HEADER)){
			console.log('no principal id, found redirecting to /.auth/login/aad');
			ctx.redirect('/.auth/login/aad?domain_hint='+ DOMAIN_HINT +'&post_login_redirect_url=' + ctx.url);
		}  
	} else {
		console.log('Authentication is NOT enabled for site. Value of WEBSITE_AUTH_ENABLED=' + process.env['WEBSITE_AUTH_ENABLED']);
	}
}

provider.initialize({
		clients,
		keystore: { keys: certificates },
	}).then(() => {
	render(provider.app, {
		cache: false,
		layout: '_layout',
		root: path.join(__dirname, 'views'),
	});

	if (process.env.NODE_ENV === 'hosted') {
		provider.proxy = true;
		set(config, 'cookies.short.secure', true);
		set(config, 'cookies.long.secure', true);

		provider.use(async (ctx, next) => {
			if (ctx.secure) {
				await next();
			} else if (ctx.method === 'GET' || ctx.method === 'HEAD') {
				ctx.redirect(ctx.href.replace(/^http:\/\//i, 'https://'));
			} else {
				ctx.body = {
						error: 'invalid_request',
						error_description: 'only use https',
				};
				ctx.status = 400;
			}
		});
	}

	const router = new Router(); 

  
	router.get('/interaction/:grant', async (ctx, next) => {

		const details = await provider.interactionDetails(ctx.req);
		const client = await provider.Client.find(details.params.client_id);
		
		enforceAuthenticationIfEnabled(ctx);

		if (details.interaction.error === 'login_required') {
			await ctx.render('login', {
				client,
				details,
				title: 'Sign in',
				principalName: ctx.request.header[PRINCIPAL_NAME_HEADER] || 'anonymous',
				debug: querystring.stringify(details.params, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
				interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
			});
		} else {
			await ctx.render('interaction', {
				client,
				details,
				title: 'Authorize',
				debug: querystring.stringify(details.params, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
				interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
					encodeURIComponent: value => value,
				}),
			});
		}

		await next();
	});

	const body = bodyParser();

	router.post('/interaction/:grant/confirm', body, async (ctx, next) => {
		enforceAuthenticationIfEnabled(ctx);
		const result = { consent: {} };
		await provider.interactionFinished(ctx.req, ctx.res, result);
		await next();
	});

	router.post('/interaction/:grant/login', body, async (ctx, next) => {
		
		enforceAuthenticationIfEnabled(ctx);
		const principalName = ctx.request.header[PRINCIPAL_NAME_HEADER] || 'anonymous';
		const account = await Account.findByLogin(ctx.request.body.login, principalName);
		const details = await provider.interactionDetails(ctx.req);
		const result = {
				login: {
					account: account.accountId,
					acr: details.params.acr_values,
					amr: '',
					remember: !!ctx.request.body.remember,
					ts: Math.floor(Date.now() / 1000),
				},
				consent: {},
		};
		await provider.interactionFinished(ctx.req, ctx.res, result);
		await next();
	});

	// serve files in public folder (css, js etc)
	provider.use(serve(__dirname + '/public'));
	provider.use(router.routes());
})
.then(() => provider.listen(port))
.catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
