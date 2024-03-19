import { PartialType } from '@nestjs/swagger';
import { CreateCrprototypeDto } from './create-crprototype.dto';

export class UpdateCrprototypeDto extends PartialType(CreateCrprototypeDto) {}
