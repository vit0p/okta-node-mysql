import session from 'express-session';
import express from 'express';
import { ExpressOIDC } from '@okta/oidc-middleware';
import OktaJwtVerifier from '@okta/jwt-verifier';
import { JsonErrorResponse } from 'express-with-json';
import { assertUser } from './user';

const issuer = `${process.env.OKTA_ORG_URL}/oauth2/default`;

export function initializeAuthentication(app: express.Application, port: number) {
  const oidc = new ExpressOIDC({
    issuer,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
    scope: 'openid profile'
  });

  app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: false
  }));
  app.use(oidc.router);

  app.get('/', oidc.ensureAuthenticated(), (req: any, res) => {
    res.send(req.userContext.tokens.access_token);
  });

  return oidc;
}

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer,
  clientId: process.env.OKTA_CLIENT_ID
})

export async function requireUser(req: express.Request) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new JsonErrorResponse({ error: 'You must send an Authorization header' }, { statusCode: 400 });
  }

  const [authType, token] = authorization.split(' ');
  if (authType !== 'Bearer') {
    throw new Error('Expected a Bearer token');
  }

  const { claims: { sub } } = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
  req.user = await assertUser(sub);
}
