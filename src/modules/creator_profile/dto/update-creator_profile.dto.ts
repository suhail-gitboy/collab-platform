import { PartialType } from '@nestjs/mapped-types';
import { CreateCreatorProfileDto } from './create-creator_profile.dto';

export class UpdateCreatorProfileDto extends PartialType(CreateCreatorProfileDto) {}
