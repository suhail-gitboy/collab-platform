import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import sequelize from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Language } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Language])],
  exports: [LanguageService],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule { }
