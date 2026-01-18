import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Invitation } from './entities/invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Invitation])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // Exporting the service to be used in other modules
})
export class UserModule { }

