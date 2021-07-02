import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
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
    private connection: Connection,
  ) {}

  // async getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await this.usersRepository.save({
        email,
        nickname,
        password: hashedPassword,
      });
      await this.workspaceMembersRepository.save({
        userId: returned.id,
        workspaceId: 1,
      });
      await this.channelMembersRepository.save({
        userId: returned.id,
        channelId: 1,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return true;
  }
}
