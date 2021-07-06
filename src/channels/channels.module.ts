import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/channelChats.entity';
import { ChannelMembers } from 'src/entities/channelMembers.entity';
import { Channels } from 'src/entities/channels.entity';
import { Users } from 'src/entities/user.entity';
import { Workspaces } from 'src/entities/workspaces.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelChats,
      Users,
      Workspaces,
      ChannelMembers,
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
