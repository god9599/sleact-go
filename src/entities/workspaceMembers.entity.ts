import { Users } from './user.entity';
import { Workspaces } from './workspaces.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ schema: 'sleact', name: 'workspacemembers' })
export class WorkspaceMembers {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { primary: true, name: 'workspaceId' })
  workspaceId: number;

  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('datetime', { name: 'loggedInAt', nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => Users, (users) => users.WorkspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.WorkspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspaces;
}
