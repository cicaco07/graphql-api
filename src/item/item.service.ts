import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async create(input: CreateItemInput): Promise<Item> {
    const newItem = new this.itemModel(input);
    return newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }
  async update(id: string, input: UpdateItemInput): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, input, { new: true, runValidators: true })
      .exec();
    if (!updatedItem) {
      throw new Error(`Item with id ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<Item> {
    const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new Error(`Item with id ${id} not found`);
    }
    return deletedItem;
  }
}
