import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { HelpersService } from 'src/helpers/helpers.service';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './model/category-model';

@Injectable()
export class CategoriesService {

  constructor(private helperService: HelpersService, @InjectModel(Category) private Categorymodel: typeof Category) {

  }
  async create(
    createCategoryDto: { name: string },
    icon: Express.Multer.File,
  ) {
    console.log(icon);

    if (!icon) {
      throw new BadRequestException(
        'Category icon is required',
      );
    }

    try {
      // Upload icon to Cloudinary
      const iconUrl =
        await this.helperService.CloudinarySetup(
          icon,
          'icon',
        );

      // Create category
      const category =
        await this.Categorymodel.create({
          name: createCategoryDto.name,
          icon: iconUrl,


        });

      return category;
    } catch (error) {
      // Duplicate category name
      if (
        error.name ===
        'SequelizeUniqueConstraintError'
      ) {
        throw new ConflictException(
          'Category name already exists',
        );
      }

      throw error;
    }
  }

  async findAll() {
    try {
      const item = await this.Categorymodel.findAll({
        where: {
          isActive: true
        }
      })
      if (!item) throw new NotFoundException('not categories')

      return item

    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }

  }



  async update(id: string, createCategoryDto: { name: string },
    icon: Express.Multer.File,) {
    try {
      let after = await this.Categorymodel.findByPk(id)
      let Oldicon = after?.icon
      if (icon) {
        Oldicon = await this.helperService.CloudinarySetup(icon, "icon")
      }

      await after?.update({
        name: createCategoryDto.name,
        icon: Oldicon
      })
      return {
        message: 'Category updated successfully',
        after,
      };

    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: string) {
    const category = await this.Categorymodel.findByPk(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await category.destroy();

    return {
      message: 'Category deleted successfully',
    };
  }

  async ChangeStatus(id: string) {
    try {
      if (!id) throw new NotFoundException("id not found")
      let set = await this.Categorymodel.findByPk(id)
      const activestatus = set?.isActive == true ? false : true
      await set?.update({
        isActive: activestatus

      })

      return set
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
