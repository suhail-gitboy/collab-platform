import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { HelpersService } from 'src/helpers/helpers.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import sequelize from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model/category-model';

@Module({
  imports: [
    HelpersModule, SequelizeModule.forFeature([
      Category
    ])


  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
