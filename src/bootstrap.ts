import { createConnection } from 'typeorm';
import express from 'express';
import withJson from 'express-with-json'
import glob from 'glob';
import path from 'path';
import bodyParser from 'body-parser';
import {authenticateUser, initializeAuthentication} from './services/okta';
import { errorHandler } from './services/error-handler';
import {entityNotFoundErrorHandler} from "./services/entity-not-found-error-handler";

const port = 3000;

function findAllControllers() {
  return glob
    .sync(path.join(__dirname, 'controllers/*'), { absolute: true })
    .map(controllerPath => require(controllerPath).default)
    .filter(applyController => applyController);
}

export async function bootstrap() {
  await createConnection();
  const app = withJson(express());
  app.useAsync(authenticateUser);
  app.use(bodyParser.json());
  initializeAuthentication(app, port);

  findAllControllers().map(applyController => applyController(app));
  app.use(entityNotFoundErrorHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log('Listening on port', port));

  return app;
}
