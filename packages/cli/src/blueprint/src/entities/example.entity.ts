import { Entity } from '../../../../../database';

import { Entity, Column, PrimaryGeneratedColumn } from '@node-cool/database';
import { ExampleDTO } from '../dto/entity.dto';

@Entity()
export class ExampleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @Column()
  public name: string;

  public toDTO(): ExampleDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }
}