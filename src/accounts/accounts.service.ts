import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: any) {
    return this.prisma.account.create({
      data: {
        userId,
        balance: data.balance ?? 0,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();
    if (account.userId !== userId) throw new ForbiddenException();

    return account;
  }

  async update(userId: string, accountId: string, data: any) {
    await this.findOne(userId, accountId);

    return this.prisma.account.update({
      where: { id: accountId },
      data,
    });
  }

  async remove(userId: string, accountId: string) {
    await this.findOne(userId, accountId);

    return this.prisma.account.delete({
      where: { id: accountId },
    });
  }
}