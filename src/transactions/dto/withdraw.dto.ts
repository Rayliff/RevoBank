import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';    

export class WithdrawDto {
  @ApiProperty({ example: 'test@mail.com' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  amount: number;
}
