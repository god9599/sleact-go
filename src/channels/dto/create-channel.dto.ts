import { PickType } from '@nestjs/swagger';
import { Channels } from '../../entities/channels.entity';

export class CreateChannelDto extends PickType(Channels, ['name']) {}
