import { createConnection } from 'typeorm';
import express from 'express';
import withExpress from 'express-with-json'
import glob from 'glob';
import path from 'path';
import bodyParser from 'body-parser';
import { initializeAuthentication } from './services/okta';

const port = 3000;

function findAllControllers() {
  return glob
    .sync(path.join(__dirname, 'controllers/*'), { absolute: true })
    .map(controllerPath => require(controllerPath).default)
    .filter(applyController => applyController);
}

export async function bootstrap() {
  await createConnection();
  const app = withExpress(express());
  app.use(bodyParser.json());
  initializeAuthentication(app, port);

  findAllControllers().map(applyController => applyController(app));

  app.listen(port, () => console.log('Listening on port', port));
}
