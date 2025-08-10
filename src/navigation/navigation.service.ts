import { Injectable } from '@nestjs/common';
import { CreateNavigationInput } from './dto/create-navigation.input';
import { UpdateNavigationInput } from './dto/update-navigation.input';
import { Navigation } from './schemas/navigation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name) private navigationModel: Model<Navigation>,
  ) {}

  async create(
    createNavigationInput: CreateNavigationInput,
  ): Promise<Navigation> {
    return this.navigationModel.create(createNavigationInput);
  }

  async findAll(): Promise<Navigation[]> {
    return this.navigationModel.find().exec();
  }

  async findOne(id: string): Promise<Navigation | null> {
    return this.navigationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateNavigationInput: UpdateNavigationInput,
  ): Promise<Navigation | null> {
    return this.navigationModel
      .findByIdAndUpdate(id, updateNavigationInput, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Navigation | null> {
    return this.navigationModel.findByIdAndDelete(id).exec();
  }
}
