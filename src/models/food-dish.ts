import { Entity, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant';

@Entity()
export class FoodDish {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'integer' })
  priceInCents: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.foodDishes)
  restaurant: Restaurant;
}
