import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service'; // 🟢 GANTI
import { PrismaService } from '../prisma/prisma.service'; // 🟢 TAMBAH
import { JwtService } from '@nestjs/jwt'; // 🟢 TAMBAH

describe('AuthService', () => {
  let service: AuthService; // 🟢 GANTI

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,      // 🟢 GANTI
        PrismaService,    // 🟢 TAMBAH (dependency)
        JwtService,       // 🟢 TAMBAH (dependency)
      ],
    }).compile();

    service = module.get<AuthService>(AuthService); // 🟢 GANTI
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); // ✅ SUDAH BENAR
  });
});
