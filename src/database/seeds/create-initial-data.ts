import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Workspaces } from '../../entities/workspaces.entity';
import { Channels } from '../../entities/channels.entity';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: '일반', workspaceId: 1, private: false }])
      .execute();
  }
}
