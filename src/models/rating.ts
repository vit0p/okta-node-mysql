import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { Restaurant } from './restaurant';
import { User } from './user';

@Entity()
@Unique(['restaurantId', 'creatorId'])
export class Rating {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ type: 'integer' })
  rating: number;

  @Column()
  text: string;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.ratings)
  restaurant: Promise<Restaurant>;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.ratings)
  creator: Promise<User>;
}
