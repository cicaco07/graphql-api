import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { HeroService } from './hero.service';
import { Hero } from './entities/hero.entity';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';

@Resolver(() => Hero)
export class HeroResolver {
  constructor(private readonly heroService: HeroService) {}

  @Mutation(() => Hero)
  createHero(@Args('input') input: CreateHeroInput) {
    return this.heroService.create(input);
  }

  @Mutation(() => Hero)
  createHeroWithSkill(@Args('input') input: CreateHeroInput) {
    return this.heroService.createHeroWithSkill(input);
  }

  @Mutation(() => Hero)
  createHeroWithSkillandSkillDetail(@Args('input') input: CreateHeroInput) {
    return this.heroService.createHeroWithSkillandSkillDetail(input);
  }

  @Query(() => [Hero], { name: 'heroes' })
  findAll() {
    return this.heroService.findAll();
  }

  @Query(() => [Hero], { name: 'heroByName' })
  findByName(@Args('name') name: string) {
    return this.heroService.findByName(name);
  }

  @Query(() => Hero, { name: 'hero' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.heroService.findById(id);
  }

  @Mutation(() => Hero)
  updateHero(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateHeroInput,
  ) {
    return this.heroService.update(id, input);
  }

  @Mutation(() => Hero)
  removeHero(@Args('id', { type: () => ID }) id: string) {
    return this.heroService.remove(id);
  }
}
