import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { FoodDish } from './food-dish';
import { User } from './user';
import { Rating } from './rating';

@Entity()
export class Restaurant {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @OneToMany(() => FoodDish, foodDish => foodDish.restaurant)
  foodDishes: Array<FoodDish>;

  @ManyToOne(() => User, user => user.restaurants, { eager: true })
  creator: User;

  @OneToMany(() => Rating, rating => rating.restaurant)
  ratings: Array<Restaurant>;
}
