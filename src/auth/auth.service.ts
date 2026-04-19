import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sing-in-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'src/generated/prisma/client';

type AuthResponse = {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Register a new user.
   * - Validates password confirmation
   * - Hashes password using bcrypt
   * - Relies on database constraint for email uniqueness
   *
   * @param dto Registration payload
   * @returns JWT access token
   * @throws BadRequestException for invalid input or duplicate email
   */
  async create(dto: CreateUserDto): Promise<AuthResponse> {
    const { name, email, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const payload = { sub: user.id, email: user.email };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      // Unique constraint violation (email already exists)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already in use');
      }

      throw error;
    }
  }

  /**
   * Authenticate a user.
   * - Validates email and password
   * - Returns JWT if credentials are valid
   *
   * @param dto Login payload
   * @returns JWT access token
   * @throws UnauthorizedException for invalid credentials
   */
  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}