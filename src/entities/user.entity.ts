import { ChannelChats } from './channelChats.entity';
import { ChannelMembers } from './channelMembers.entity';
import { DMs } from './dms.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Mentions } from './mentions.entity';
import { WorkspaceMembers } from './workspaceMembers.entity';
import { Workspaces } from './workspaces.entity';
import { Channels } from './channels.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Entity({ schema: 'sleact', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @Column('varchar', { name: 'email', unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.user)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.user)
  ChannelMembers: ChannelMembers[];

  @OneToMany(() => DMs, (dms) => dms.sender)
  DMs: DMs[];

  @OneToMany(() => DMs, (dms) => dms.receiver)
  DMs2: DMs[];

  @OneToMany(() => Mentions, (mentions) => mentions.sender)
  Mentions: Mentions[];

  @OneToMany(() => Mentions, (mentions) => mentions.receiver)
  Mentions2: Mentions[];

  @OneToMany(
    () => WorkspaceMembers,
    (workspacemembers) => workspacemembers.user,
  )
  WorkspaceMembers: WorkspaceMembers[];

  // ??
  @OneToMany(() => Workspaces, (workspaces) => workspaces.owner)
  OwnedWorkspaces: Workspaces[];

  @ManyToMany(() => Workspaces, (workspaces) => workspaces.members)
  @JoinTable({
    name: 'workspacemembers',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'workspaceId',
      referencedColumnName: 'id',
    },
  })
  Workspaces: Workspaces[];

  @ManyToMany(() => Channels, (channels) => channels.Members)
  @JoinTable({
    name: 'channelmembers',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
  })
  Channels: Channels[];
}
