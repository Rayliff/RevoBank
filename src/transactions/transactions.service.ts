import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: string, accountId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();
    if (account.userId !== userId) throw new ForbiddenException();

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          accountId,
          type: TransactionType.DEPOSIT,
          amount,
        },
      }),
    ]);
  }

  async withdraw(userId: string, accountId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();
    if (account.userId !== userId) throw new ForbiddenException();
    if (account.balance < amount)
      throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          accountId,
          type: TransactionType.WITHDRAW,
          amount,
        },
      }),
    ]);
  }

  async transfer(
    userId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    if (fromAccountId === toAccountId)
      throw new BadRequestException('Same account');

    const from = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });
    const to = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!from || !to) throw new NotFoundException();
    if (from.userId !== userId) throw new ForbiddenException();
    if (from.balance < amount)
      throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          accountId: fromAccountId,
          type: TransactionType.TRANSFER,
          amount,
        },
      }),
    ]);
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!trx) throw new NotFoundException();
    if (trx.account.userId !== userId) throw new ForbiddenException();

    return trx;
  }
}
