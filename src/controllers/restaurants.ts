import express from 'express';
import { getManager } from 'typeorm';

import { Restaurant } from '../models/restaurant';
/* import { requireUser } from '../services/okta'; */
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { User } from '../models/user';

function isRestaurantCreatedBy(restaurant: Restaurant, user: User) {
  return restaurant.creatorId === user.id;
}

export async function createRestaurant(req: express.Request) {
  const { address, description, name, } = req.body;

  const restaurant = new Restaurant();
  restaurant.creatorId = 1;
  restaurant.address = address;
  restaurant.description = description;
  restaurant.name = name;

  const manager = getManager();
  return await manager.save(restaurant);
}

export async function removeRestaurant(req: express.Request) {
  const { id } = req.params;
  const manager = getManager();
  const restaurant = await manager.findOneOrFail(Restaurant, id);

  await manager.remove(restaurant);
  return { ok: true };
}

export async function getAllRestaurants() {
  const manager = getManager();

  return await manager.find(Restaurant);
}

export async function getRestaurant(req: express.Request) {
  const { id } = req.params;
  const manager = getManager();

  return await manager.findOneOrFail(Restaurant, id);
}

export async function updateRestaurant(req: express.Request) {
  const { id } = req.params;
  const { address, description, name, } = req.body;
  const manager = getManager();

  const restaurant = await manager.findOneOrFail(Restaurant, id);

  restaurant.address = address;
  restaurant.description = description;
  restaurant.name = name;

  return await manager.save(restaurant);
}

export default (app: IExpressWithJson) => {
  app.postJson('/restaurants', createRestaurant);
  app.deleteJson('/restaurants/:id', removeRestaurant);
  app.getJson('/restaurants', getAllRestaurants);
  app.getJson('/restaurants/:id', getRestaurant);
  app.patchJson('/restaurants/:id', updateRestaurant);
}
