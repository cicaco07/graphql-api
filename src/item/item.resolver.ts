import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createItem(@Args('input') input: CreateItemInput) {
    return this.itemService.create(input);
  }

  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.itemService.findOne(id);
  }

  @Query(() => [Item], { name: 'childrenItems' })
  findChildren(@Args('parentId', { type: () => ID }) parentId: string) {
    return this.itemService.findChildren(parentId);
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateItem(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateItemInput,
  ) {
    return this.itemService.update(id, input);
  }

  @Mutation(() => Item)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeItem(@Args('id', { type: () => ID }) id: string) {
    return this.itemService.remove(id);
  }
}
