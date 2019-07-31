import { Restaurant } from '../models/restaurant';
import { User } from '../models/user';

export function isRestaurantCreatedBy(restaurant: Restaurant, user: User) {
  return this.restaurant.creator.id === user.id;
}
