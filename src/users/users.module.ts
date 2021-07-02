import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { WorkspaceMembers } from '../entities/workspaceMembers.entity';
import { ChannelMembers } from 'src/entities/channelMembers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
  ], // 레포지토리를 service에 injection
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
