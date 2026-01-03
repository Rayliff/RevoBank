import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({ example: 200000 })
  @IsOptional()
  @IsNumber()
  balance?: number;
}