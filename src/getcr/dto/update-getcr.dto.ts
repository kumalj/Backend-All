import { PartialType } from '@nestjs/mapped-types';
import { CreateGetCrDto } from './create-getcr.dto';

export class UpdateGetCrDto extends PartialType(CreateGetCrDto) {}
