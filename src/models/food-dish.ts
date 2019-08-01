import {Entity, Column, ManyToOne, PrimaryColumn, Unique} from 'typeorm';
import { Restaurant } from './restaurant';

@Entity()
@Unique(['restaurantId', 'name'])
export class FoodDish {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'integer' })
  priceInCents: number;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.foodDishes)
  restaurant: Promise<Restaurant>;
}
