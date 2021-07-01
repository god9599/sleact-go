import { ChannelChats } from './channelChats.entity';
import { ChannelMembers } from './channelMembers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './user.entity';
import { Workspaces } from './workspaces.entity';

@Entity({ schema: 'sleact' })
export class Channels {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'workspaceId', nullable: true })
  workspaceId: number | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.Channel)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.Channel)
  ChannelMembers: ChannelMembers[];

  @ManyToMany(() => Users, (users) => users.Channels)
  Members: Users[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.Channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspaces;
}
