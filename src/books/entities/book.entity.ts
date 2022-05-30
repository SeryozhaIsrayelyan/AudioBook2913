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

  @Column({ nullable: true})
  descriptionEnglish: string;

  @Column({ nullable: true})
  descriptionArabic: string;

  @Column()
  authorEnglish: string;

  @Column()
  authorArabic: string;

  @Column({ default: 'png' })
  imageext: string;

  @Column({ default: false})
  isImage: boolean;

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

  @Column({nullable:true})
  narrator: number;

  @Column({ default: 1 })
  status: number;

  @Column({nullable:true})
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
