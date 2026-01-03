import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private trxService: TransactionsService) {}

  @Post('deposit')
  deposit(@Req() req, @Body() dto: DepositDto) {
    return this.trxService.deposit(
      req.user.sub,
      dto.accountId,
      dto.amount,
    );
  }

  @Post('withdraw')
  withdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.trxService.withdraw(
      req.user.sub,
      dto.accountId,
      dto.amount,
    );
  }

  @Post('transfer')
  transfer(@Req() req, @Body() dto: TransferDto) {
    return this.trxService.transfer(
      req.user.sub,
      dto.fromAccountId,
      dto.toAccountId,
      dto.amount,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.trxService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.trxService.findOne(req.user.sub, id);
  }
}
