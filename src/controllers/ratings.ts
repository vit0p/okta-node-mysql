import express from 'express';
import { Rating } from '../models/rating';
import { getManager } from "typeorm";
import { IExpressWithJson } from 'express-with-json';
import { requireUser } from '../services/okta';

export async function createRating(req: express.Request) {
  const { restaurantId } = req.params;
  const { rating: ratingNumber, text } = req.body;

  const rating = new Rating();
  rating.creatorId = req.user.id;
  rating.rating = ratingNumber;
  rating.restaurantId = parseInt(restaurantId);
  rating.text = text;

  return await getManager().save(rating);
}

export async function getUserRating(req: express.Request) {
  const { restaurantId } = req.params;
  const creatorId = req.user.id;

  return await getManager().findOneOrFail(Rating, { where: { restaurantId, creatorId } });
}

export async function updateRating(req: express.Request) {
  const { restaurantId } = req.params;
  const { rating: ratingNumber, text } = req.body;
  const creatorId = req.user.id;

  const manager = await getManager();

  const rating = await manager.findOneOrFail(Rating, { where: { restaurantId, creatorId } });
  if (ratingNumber !== undefined) {
    rating.rating = ratingNumber;
  }
  if (text !== undefined) {
    rating.text = text;
  }

  return await manager.save(rating);
}

export async function getRestaurantRatings(req: express.Request) {
  const { restaurantId } = req.params;

  return await getManager().find(Rating, { where: { restaurantId } });
}

export default function(app: IExpressWithJson) {
  app.postJson('/restaurants/:restaurantId/ratings', requireUser, createRating);
  app.getJson('/restaurants/:restaurantId/ratings', getRestaurantRatings);
  app.getJson('/restaurants/:restaurantId/ratings/my', requireUser, getUserRating);
  app.patchJson('/restaurants/:restaurantId/ratings/my', requireUser, updateRating);
}