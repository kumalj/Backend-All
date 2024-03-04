import { PartialType } from '@nestjs/mapped-types';
import { CreateChngerequestDto } from './create-chngerequest.dto';

export class UpdateChngerequestDto extends PartialType(CreateChngerequestDto) {}
