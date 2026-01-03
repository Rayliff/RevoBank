import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ example: 'test@mail.com' })
  @IsUUID()
  fromAccountId: string;

  @ApiProperty({ example: 'tes@mail.com' })
  @IsUUID()
  toAccountId: string;

  @ApiProperty({ example: 100000 })
  amount: number;
}
