import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // 레포지토리를 service에 injection
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
