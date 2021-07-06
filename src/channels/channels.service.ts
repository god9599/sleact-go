import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/channelChats.entity';
import { ChannelMembers } from 'src/entities/channelMembers.entity';
import { Channels } from 'src/entities/channels.entity';
import { Users } from 'src/entities/user.entity';
import { Workspaces } from 'src/entities/workspaces.entity';
import { Repository, Connection, MoreThan } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channerMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        url: url,
        name: name,
      },
    });
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    try {
      const workspace = await this.workspacesRepository.findOne({
        where: { url },
      });
      const channel = new Channels();
      channel.name = name;
      channel.workspaceId = workspace.id;
      const channelReturned = await this.channelsRepository.save(channel);
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

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
        name,
      })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url =:url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    try {
      const channel = await this.channelsRepository
        .createQueryBuilder('channel')
        .innerJoin('channel.Workspace', 'workspace', 'workspace.url =:url', {
          url,
        })
        .where('channel.name = :name', { name })
        .getOne();
      if (!channel) {
        throw new NotFoundException('채널이 존재하지 않습니다.');
      }
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('channel.email =:email', { email })
        .innerJoin('user.Workspaces', 'workspace', 'workspace.url =:url', {
          url,
        })
        .getOne();
      if (!user) {
        throw new NotFoundException('사용자가 존재하지 않습니다.');
      }
      const channelMember = new ChannelMembers();
      channelMember.channelId = channel.id;
      channelMember.userId = user.id;
      await this.channelMembersRepository.save(channelMember);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channerChats.User', 'user')
      .orderBy('channerChats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    try {
      const channel = await this.channelsRepository
        .createQueryBuilder('channel')
        .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
          url,
        })
        .where('channel.name = :name', { name })
        .getOne();
      const chats = new ChannelChats();
      chats.content = content;
      chats.userId = myId;
      chats.channelId = channel.id;
      const savedChats = await this.channelChatsRepository.save(chats);
      const chatWithUser = await this.channelChatsRepository.findOne({
        where: { id: savedChats.id },
        relations: ['User', 'Channel'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getChannelUnreadsCount(url: string, name: string, after: number) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    return this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}
