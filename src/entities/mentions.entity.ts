import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Workspaces } from './workspaces.entity';

@Entity({ schema: 'sleact', name: 'mentions' })
export class Mentions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] })
  type: 'chat' | 'dm' | 'system';

  @Column('int', { name: 'chatId', nullable: true })
  chatId: number | null;

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

  @ManyToOne(() => Users, (users) => users.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  sender: Users;

  @ManyToOne(() => Users, (users) => users.Mentions2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  receiver: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspaces;
}
