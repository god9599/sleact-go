import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './entities/channelChats.entity';
import { ChannelMembers } from './entities/channelMembers.entity';
import { Channels } from './entities/channels.entity';
import { DMs } from './entities/dms.entity';
import { Mentions } from './entities/mentions.entity';
import { Users } from './entities/user.entity';
import { WorkspaceMembers } from './entities/workspaceMembers.entity';
import { Workspaces } from './entities/workspaces.entity';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};

export = config;
