import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Connection,
  Transaction,
  TransactionRepository,
} from 'typeorm';
import { Users } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/workspaceMembers.entity';
import { ChannelMembers } from '../entities/channelMembers.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
  ) {}

  // async getUser() {}

  @Transaction()
  async join(
    email: string,
    nickname: string,
    password: string,
    @TransactionRepository(Users) usersRepository: Repository<Users>,
    @TransactionRepository(Users)
    workspaceMembersRepository: Repository<WorkspaceMembers>,
    @TransactionRepository(Users)
    channelMembersRepository: Repository<ChannelMembers>,
  ) {
    const user = await usersRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const returned = await usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    await workspaceMembersRepository.save({
      userId: returned.id,
      workspaceId: 1,
    });
    await channelMembersRepository.save({
      userId: returned.id,
      channelId: 1,
    });
    return true;
  }
}
