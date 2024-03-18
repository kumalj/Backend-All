import { ApiProperty } from '@nestjs/swagger';

export class CreateChngerequestDto {

    @ApiProperty({ type: 'string', format: 'binary' })
  readonly file: any; // This field will hold the file data
}



