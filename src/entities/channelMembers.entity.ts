import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Channels } from './channels.entity';
import { Users } from './user.entity';

@Entity({ schema: 'sleact', name: 'channelmembers' })
export class ChannelMembers {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { primary: true, name: 'channelId' })
  channelId: number;

  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @ManyToOne(() => Channels, (channels) => channels.ChannelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channels;

  @ManyToOne(() => Users, (users) => users.ChannelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
