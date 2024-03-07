import { PartialType } from '@nestjs/mapped-types';
import { CreateCrPrototypeDto } from './create-cr-prototype.dto';

export class UpdateCrPrototypeDto extends PartialType(CreateCrPrototypeDto) {}
