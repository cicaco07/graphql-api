import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
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
  updateItem(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateItemInput,
  ) {
    return this.itemService.update(id, input);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }) id: string) {
    return this.itemService.remove(id);
  }
}
