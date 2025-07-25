import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EmblemService } from './emblem.service';
import { Emblem } from './entities/emblem.entity';
import { CreateEmblemInput } from './dto/create-emblem.input';
import { UpdateEmblemInput } from './dto/update-emblem.input';

@Resolver(() => Emblem)
export class EmblemResolver {
  constructor(private readonly emblemService: EmblemService) {}

  @Mutation(() => Emblem)
  createEmblem(@Args('input') input: CreateEmblemInput) {
    return this.emblemService.create(input);
  }

  @Query(() => [Emblem], { name: 'emblems' })
  findAll() {
    return this.emblemService.findAll();
  }

  @Query(() => Emblem, { name: 'emblem' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.emblemService.findOne(id);
  }

  @Mutation(() => Emblem)
  updateEmblem(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateEmblemInput,
  ) {
    return this.emblemService.update(id, input);
  }

  @Mutation(() => Emblem)
  removeEmblem(@Args('id', { type: () => ID }) id: string) {
    return this.emblemService.remove(id);
  }
}
