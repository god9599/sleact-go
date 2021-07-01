import { Users } from './user.entity';
import { Workspaces } from './workspaces.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ schema: 'sleact', name: 'dms' })
export class DMs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'workspaceId', nullable: true })
  workspaceId: number | null;

  @Column('int', { name: 'senderId', nullable: true })
  senderId: number | null;

  @Column('int', { name: 'receiverId', nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Users, (user) => user.DMs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  sender: Users;

  @ManyToOne(() => Users, (user) => user.DMs2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  receiver: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.DMs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspaces;
}
