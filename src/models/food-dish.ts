import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Restaurant } from './restaurant';

@Entity()
export class FoodDish {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'integer' })
  priceInCents: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.foodDishes)
  restaurant: Restaurant;
}
