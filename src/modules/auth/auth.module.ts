import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user-models';


@Module({
  imports: [HelpersModule, SequelizeModule.forFeature([
    User,

  ])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
