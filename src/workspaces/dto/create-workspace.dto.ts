import { PickType } from '@nestjs/swagger';
import { Workspaces } from '../../entities/workspaces.entity';

export class CreateWorkspaceDto extends PickType(Workspaces, ['name', 'url']) {}
