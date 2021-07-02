import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/user.entity';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
