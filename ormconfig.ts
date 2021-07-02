import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/entities/channelChats.entity';
import { ChannelMembers } from './src/entities/channelMembers.entity';
import { Channels } from './src/entities/channels.entity';
import { DMs } from './src/entities/dms.entity';
import { Mentions } from './src/entities/mentions.entity';
import { Users } from './src/entities/user.entity';
import { WorkspaceMembers } from './src/entities/workspaceMembers.entity';
import { Workspaces } from './src/entities/workspaces.entity';

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
