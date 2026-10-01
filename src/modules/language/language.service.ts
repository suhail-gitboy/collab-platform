import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Language } from './model';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language) private languageModel: typeof Language,
  ) { }

  create(createLanguageDto) {
    return this.languageModel.create({ ...createLanguageDto });
  }

  findAll() {
    return this.languageModel.findAll();
  }

  async findOne(id: string) {
    const language = await this.languageModel.findByPk(id);
    if (!language) {
      throw new NotFoundException(`Language #${id} not found`);
    }
    return language;
  }

  async update(id: string, updateLanguageDto) {
    const language = await this.findOne(id);
    return language.update({ ...updateLanguageDto });
  }

  async remove(id: string) {
    const language = await this.findOne(id);
    await language.destroy();
    return language;
  }
}