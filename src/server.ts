import express from 'express';
import withExpress from 'express-with-json'
import {JsonErrorResponse} from "express-with-json/dist";

const app = withExpress(express());

const port = 3001;

app.getJson('/test', (req, res) => {
  throw new Error('lalalla');
}, () => {
  return { ok: true };
});

app.listen(port, () => {
  console.log('Listening on port', port);
});
