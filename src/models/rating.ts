import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Restaurant } from './restaurant';
import { User } from './user';

@Entity()
export class Rating {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ type: 'integer' })
  rating: number;

  @Column()
  text: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.ratings)
  restaurant: Restaurant;

  @ManyToOne(() => User, user => user.ratings)
  creator: User;
}
