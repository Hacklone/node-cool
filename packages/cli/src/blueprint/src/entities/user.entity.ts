import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from '@node-cool/database';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @Column()
  public name: string;

  @Index()
  @Column()
  public email: string;

  @Column()
  public profileImageUrl: string;

  @CreateDateColumn()
  public createdAt: Date;
}
