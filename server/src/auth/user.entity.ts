import { Favorite } from 'src/favorite/favorite.entity';
import { MarkerColor } from 'src/post/marker-color.enum';
import { Post } from 'src/post/post.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email']) // 사용자마다 값이 달라야 하므로 유니크 값을 준다.
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginType: 'email' | 'kakao' | 'apple';

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  imageUri?: string;

  @Column({ nullable: true })
  kakaoImageUri?: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.RED]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.YELLOW]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.GREEN]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.BLUE]: string;

  @Column({ nullable: true, default: '' })
  [MarkerColor.PURPLE]: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => Post, (post) => post.user, { eager: false }) // eager 옵션을 주면 관계되어 있는 데이터를 함께 가져올 수 있다.
  post: Post[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorite: Favorite[];
}
