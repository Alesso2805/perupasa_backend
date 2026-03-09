import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Aquí hacemos el "seed" del admin usando variables de entorno o valores por defecto
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME', 'admin');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'admin123');

    const adminExists = await this.userRepository.findOne({ where: { username: adminUsername } });

    if (!adminExists) {
      console.log('🌱 Seeding admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = this.userRepository.create({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(newAdmin);
      console.log('✅ Admin user successfully seeded!');
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    // Buscar usuario en base de datos
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { username: user.username, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }
}

