import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }
  async login(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.usersService.findByEmail(createAuthDto.email);
      if (user && user.password === createAuthDto.password) {
        return await this.assignToken(user);
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      console.error('Login Error:', error);
      // Log errors array if it exists (safely handle AggregateError)
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error('AggregateError details:', (error as any).errors);
      }
      throw error;
    }
  }

  async assignToken(user: any) {
    // For team members, use their client's ID; for clients/admins, use their own ID
    const effectiveClientId = user.role === Role.MEMBER ? user.clientId : user.id;

    const payload = {
      username: user.email,
      sub: user.id,
      role: user.role,
      clientId: effectiveClientId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      id: payload.sub,
      clientId: effectiveClientId,
    };
  }
}
