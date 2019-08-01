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
  foodDishes: Promise<Array<FoodDish>>;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.restaurants)
  creator: Promise<User>;

  @OneToMany(() => Rating, rating => rating.restaurant)
  ratings: Promise<Array<Restaurant>>;

  @Column({ nullable: true })
  averageRating: number;
}
