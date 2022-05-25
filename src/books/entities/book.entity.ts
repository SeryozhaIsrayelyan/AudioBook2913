import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameEnglish: string;

  @Column()
  nameArabic: string;

  @Column()
  descriptionEnglish: string;

  @Column()
  descriptionArabic: string;

  @Column()
  author: string;

  @Column({ default: 'png' })
  imageext: string;

  @Column({ default: 100 })
  kickoffPledge: number;

  @Column({ nullable: true })
  goal: number;

  @Column({ default: 0 })
  donated: number;

  @Column({ nullable: true })
  deadline: Date;

  @Column()
  usersuggested: number;

  @Column({ default: 0 })
  audiocount: number;

  @Column({default: false})
  isPdfAdded: boolean;

  @Column()
  narrator: number;

  @Column({ default: 1 })
  status: number;

  @Column()
  genre: number;

  @Column()
  yearOfPublishing: number;

  @Column()
  ISBN: string;
  
  @Column({ default: 0 })
  issample: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
