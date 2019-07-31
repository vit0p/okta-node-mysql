import express from 'express';
import { getManager } from 'typeorm';

import { Restaurant } from '../models/restaurant';
import { requireUser } from '../services/okta';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { isRestaurantCreatedBy } from '../services/restaurant';
import { User } from '../models/user';

export async function createRestaurant(req: express.Request) {
  const { address, description, name, } = req.body;

  const restaurant = new Restaurant();
  restaurant.creator = req.user;
  restaurant.address = address;
  restaurant.description = description;
  restaurant.name = name;

  const manager = getManager();
  return await manager.save(restaurant);
}

export async function removeRestaurant(req: express.Request) {
  const { id } = req.params;
  const manager = getManager();
  const restaurant = await manager.findOne(Restaurant, { id });

  if (isRestaurantCreatedBy(restaurant, req.user)) {
    await manager.remove(restaurant);
    return { ok: true };
  }
  throw new JsonErrorResponse({ error: 'Forbidden' }, { statusCode: 403 });
}

export async function restaurants(req: express.Request) {
  const manager = getManager();

  return await manager.find(Restaurant);
}

export default (app: IExpressWithJson) => {
  app.postJson('/restaurants', requireUser, createRestaurant);
  app.deleteJson('/restaurants/:id', requireUser, removeRestaurant);
  app.getJson('/restaurants', restaurants);
}
