import { Entity, Column, OneToMany } from 'typeorm';
import { FoodDish } from './food-dish';

@Entity()
export class Restaurant {
  @Column()
  name: string;

  @OneToMany(() => FoodDish, foodDish => foodDish.restaurant)
  foodDishes: Array<FoodDish>;
}
