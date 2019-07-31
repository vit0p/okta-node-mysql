import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Restaurant } from './restaurant';
import { Rating } from './rating';

@Entity()
export class User {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true })
  oktaUserId: string;

  @OneToMany(() => Restaurant, restaurant => restaurant.creator)
  restaurants: Array<Restaurant>;

  @OneToMany(() => Rating, rating => rating.creator)
  ratings: Array<Rating>;
}
