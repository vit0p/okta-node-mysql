import { getManager } from 'typeorm';
import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json';
import { Rating } from '../models/rating';
/* import { requireUser } from '../services/okta'; */

export async function createRating(req: express.Request) {
  const { restaurantId } = req.params;
  const { rating: ratingString, text } = req.body;

  const ratingNumber = parseInt(ratingString);
  if (ratingNumber < 0 || ratingNumber > 5) {
    throw new JsonErrorResponse({ error: 'Rating must be between 1 and 5' }, { statusCode: 400 });
  }

  const rating = new Rating();
  rating.creatorId = 1;
  rating.rating = ratingNumber;
  rating.restaurantId = parseInt(restaurantId);
  rating.text = text;

  return await getManager().save(rating);
}

export async function getUserRating(req: express.Request) {
  const { restaurantId } = req.params;
  const creatorId = 1;

  return await getManager().findOneOrFail(Rating, { where: { restaurantId, creatorId } });
}

export async function getRestaurantRatings(req: express.Request) {
  const { restaurantId } = req.params;

  return await getManager().find(Rating, { where: { restaurantId } });
}

export default function(app: IExpressWithJson) {
  app.postJson('/restaurants/:restaurantId/ratings', createRating);
  app.getJson('/restaurants/:restaurantId/ratings', getRestaurantRatings);
  app.getJson('/restaurants/:restaurantId/ratings/my', getUserRating);
}
