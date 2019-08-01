import {Rating} from "../models/rating";
import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from "typeorm";
import {Restaurant} from "../models/restaurant";

async function getAverageRating(manager: EntityManager, restaurantId: number): Promise<number> {
  const response = await manager.query(
    `select AVG(rating) as averageRating from rating where rating.restaurantId = ${restaurantId}`
  );

  return response[0].averageRating;
}

async function recalculateAverageRating(manager: EntityManager, restaurantId: number) {
  const restaurant = await manager.findOneOrFail(Restaurant, restaurantId);
  restaurant.averageRating = await getAverageRating(manager, restaurantId);
  await manager.save(restaurant);
}

@EventSubscriber()
export class RestaurantRatingSubscriber implements EntitySubscriberInterface<Rating> {
  listenTo() {
    return Rating;
  }

  async afterInsert(event: InsertEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }

  async afterUpdate(event: UpdateEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }

  async afterRemove(event: RemoveEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }
}