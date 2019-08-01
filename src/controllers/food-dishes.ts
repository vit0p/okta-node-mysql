import express from 'express';
import {getManager} from "typeorm";
import {FoodDish} from "../models/food-dish";
import {IExpressWithJson} from "express-with-json/dist";
import {requireUser} from "../services/okta";
import {Restaurant} from "../models/restaurant";

export async function createFoodDish(req: express.Request) {
  const { restaurantId } = req.params;
  const manager = getManager();
  await manager.findOneOrFail(Restaurant, restaurantId);

  const { description, name, priceInCents } = req.body;

  const foodDish = new FoodDish();
  foodDish.description = description;
  foodDish.name = name;
  foodDish.priceInCents = parseInt(priceInCents);
  foodDish.restaurantId = parseInt(restaurantId);

  return manager.save(foodDish);
}

export async function getRestaurantFoodDishes(req: express.Request) {
  const { restaurantId } = req.params;

  return await getManager().find(FoodDish, { where: { restaurantId } });
}

export default (app: IExpressWithJson) => {
  app.postJson('/restaurants/:restaurantId/food-dishes', requireUser, createFoodDish);
  app.getJson('/restaurants/:restaurantId/food-dishes', getRestaurantFoodDishes);
}
