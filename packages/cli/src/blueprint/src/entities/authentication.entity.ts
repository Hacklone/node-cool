import { AuthenticationType } from '@node-cool/authentication';
import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from '@node-cool/database';

@Entity()
export class AuthenticationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @Index()
  @Column()
  public authId: string;

  @Index()
  @Column({
    type: 'enum',
    enum: AuthenticationType,
  })
  public type: AuthenticationType;

  @CreateDateColumn()
  public createdAt: Date;
}
