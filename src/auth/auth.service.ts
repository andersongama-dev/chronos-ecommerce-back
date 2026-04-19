import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SingInDto } from './dto/sing-in-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private readonly jwtService: JwtService) { }

  async create(createAuthDto: CreateAuthDto) {
  const { name, email, password, confirmPassword } = createAuthDto;

  if (!name || !email || !password || confirmPassword !== password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const userExists = await this.prisma.users.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await this.prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const payload = { email: user.email, sub: user.id };

  return {
    accessToken: this.jwtService.sign(payload),
  };
}

  async signIn(singInDto: SingInDto) {
    const { email, password } = singInDto

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) }
  }
}