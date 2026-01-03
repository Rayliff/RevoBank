import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 100000 })
  @IsOptional()
  @IsNumber()
  balance?: number;
}