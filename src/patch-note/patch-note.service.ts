import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PatchNote, PatchNoteDocument } from './schemas/patch-note.schema';
import { CreatePatchNoteInput } from './dto/create-patch-note.input';
import { UpdatePatchNoteInput } from './dto/update-patch-note.input';
import {
  ChangeType,
  PatchNoteEntity,
  PatchNoteType,
  Priority,
} from './entities/patch-note.entity';

export interface FilterPatchNoteInput {
  version?: string;
  types?: string[];
  changeTypes?: string[];
  priorities?: string[];
  targetEntity?: string;
  tags?: string[];
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedPatchNotes {
  data: PatchNote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PatchNoteService {
  constructor(
    @InjectModel(PatchNote.name)
    private patchNoteModel: Model<PatchNoteDocument>,
  ) {}

  async create(
    createPatchNoteInput: CreatePatchNoteInput,
  ): Promise<PatchNoteEntity> {
    try {
      const createdPatchNote = new this.patchNoteModel({
        ...createPatchNoteInput,
        publishedAt: createPatchNoteInput.publishedAt || new Date(),
      });

      const saved = await createdPatchNote.save();
      return this.transformToEntity(saved);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create patch note: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findAll(
    filter: FilterPatchNoteInput = {},
  ): Promise<PaginatedPatchNotes> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      ...filterOptions
    } = filter;

    // Build filter query
    const query: FilterQuery<PatchNoteDocument> = {};

    // Apply filters
    if (filterOptions.version) {
      query.version = filterOptions.version;
    }

    if (filterOptions.types && filterOptions.types.length > 0) {
      query.type = { $in: filterOptions.types };
    }

    if (filterOptions.changeTypes && filterOptions.changeTypes.length > 0) {
      query.changeType = { $in: filterOptions.changeTypes };
    }

    if (filterOptions.priorities && filterOptions.priorities.length > 0) {
      query.priority = { $in: filterOptions.priorities };
    }

    if (filterOptions.targetEntity) {
      query.targetEntity = {
        $regex: filterOptions.targetEntity,
        $options: 'i',
      };
    }

    if (filterOptions.tags && filterOptions.tags.length > 0) {
      query.tags = { $in: filterOptions.tags };
    }

    if (filterOptions.isActive !== undefined) {
      query.isActive = filterOptions.isActive;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { targetEntity: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'DESC' ? -1 : 1;

    // Execute queries
    const [data, total] = await Promise.all([
      this.patchNoteModel
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.patchNoteModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findById(id).exec();

    if (!patchNote) {
      throw new NotFoundException(`Patch note with ID ${id} not found`);
    }

    return patchNote;
  }

  async findByVersion(version: string): Promise<PatchNote[]> {
    return await this.patchNoteModel
      .find({ version, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTargetEntity(targetEntity: string): Promise<PatchNote[]> {
    return await this.patchNoteModel
      .find({
        targetEntity: { $regex: targetEntity, $options: 'i' },
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTags(tags: string[]): Promise<PatchNote[]> {
    return await this.patchNoteModel
      .find({
        tags: { $in: tags },
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(updatePatchNoteInput: UpdatePatchNoteInput): Promise<PatchNote> {
    const { _id, ...updateData } = updatePatchNoteInput;

    const updatedPatchNote = await this.patchNoteModel
      .findByIdAndUpdate(_id, updateData, { new: true })
      .exec();

    if (!updatedPatchNote) {
      throw new NotFoundException(`Patch note with ID ${_id} not found`);
    }

    return updatedPatchNote;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.patchNoteModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Patch note with ID ${id} not found`);
    }

    return true;
  }

  async softDelete(id: string, userId: string): Promise<PatchNote> {
    const updatedPatchNote = await this.patchNoteModel
      .findByIdAndUpdate(
        id,
        { isActive: false, updatedBy: userId },
        { new: true },
      )
      .exec();

    if (!updatedPatchNote) {
      throw new NotFoundException(`Patch note with ID ${id} not found`);
    }

    return updatedPatchNote;
  }

  private transformToEntity(doc: PatchNoteDocument): PatchNoteEntity {
    return {
      _id: (doc._id as string).toString(),
      version: doc.version,
      title: doc.title,
      description: doc.description,
      type: doc.type as PatchNoteType,
      changeType: doc.changeType as ChangeType,
      priority: doc.priority as Priority,
      targetEntity: doc.targetEntity,
      targetEntityId: doc.targetEntityId,
      tags: doc.tags,
      previousValue: doc.previousValue,
      newValue: doc.newValue,
      additionalData: doc.additionalData ? doc.additionalData : undefined,
      isActive: doc.isActive,
      publishedAt: doc.publishedAt,
      createdBy: doc.createdBy,
      updatedBy: doc.updatedBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
