import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/channelMembers.entity';
import { Channels } from 'src/entities/channels.entity';
import { Users } from 'src/entities/user.entity';
import { WorkspaceMembers } from 'src/entities/workspaceMembers.entity';
import { Repository, Connection } from 'typeorm';
import { Workspaces } from '../entities/workspaces.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspaceRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    return this.workspaceRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        WorkspaceMembers: [{ userId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    const workspace = this.workspaceRepository.create({
      name,
      url,
      ownerId: myId,
    });
    try {
      const returned = await this.workspaceRepository.save(workspace);
      const workspaceMember = new WorkspaceMembers();
      workspaceMember.userId = myId;
      workspaceMember.workspaceId = returned.id;
      const channel = new Channels();
      channel.name = '일반';
      channel.workspaceId = returned.id;
      const [, channelReturned] = await Promise.all([
        this.workspaceMembersRepository.save(workspaceMember),
        this.channelsRepository.save(channel),
      ]);
      const channelMember = new ChannelMembers();
      channelMember.userId = myId;
      channelMember.channelId = channelReturned.id;
      await this.channelMembersRepository.save(channelMember);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.WorkspaceMembers', 'm')
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url: url })
      .getMany();
  }

  async createWorkspaceMembers(url: string, email: string) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { url },
        //relations: ['Channels']
        join: {
          alias: 'workspace',
          innerJoinAndSelect: {
            channels: 'workspace.Channels',
          },
        },
        // this.workspaceRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'Channels').getOne();
      });
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        return null;
      }
      const workspaceMember = new WorkspaceMembers();
      workspaceMember.workspaceId = workspace.id;
      workspaceMember.userId = user.id;
      await this.workspaceMembersRepository.save(workspaceMember);
      const channelMember = new ChannelMembers();
      channelMember.channelId = workspace.Channels.find(
        (v) => v.name === '일반',
      ).id;
      channelMember.userId = user.id;
      await this.channelMembersRepository.save(channelMember);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
