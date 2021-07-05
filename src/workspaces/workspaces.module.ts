import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMembers } from '../entities/workspaceMembers.entity';
import { Workspaces } from '../entities/workspaces.entity';
import { Users } from '../entities/user.entity';
import { ChannelMembers } from '../entities/channelMembers.entity';
import { Channels } from '../entities/channels.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceMembers,
      Workspaces,
      Users,
      ChannelMembers,
      Channels,
    ]),
  ],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
