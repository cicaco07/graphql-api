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
  createHeroWithSkillDetail(@Args('input') input: CreateHeroInput) {
    return this.heroService.createHeroWithSkillDetail(input);
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
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.heroService.findOne(id);
  }

  @Mutation(() => Hero)
  updateHero(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateHeroInput,
  ) {
    return this.heroService.update(id, input);
  }

  // @Mutation(() => Hero)
  // async updateHeroToSkills(
  //   @Args('heroId', { type: () => ID }) heroId: string,
  //   @Args('skillId', { type: () => ID }) skillId: string,
  // ): Promise<Hero> {
  //   const hero = await this.heroService.updateHeroToSkills(heroId, [skillId]);
  //   return {
  //     ...hero,
  //     _id: String(hero._id),
  //   } as Hero;
  // }

  @Mutation(() => Hero)
  removeHero(@Args('id', { type: () => ID }) id: string) {
    return this.heroService.remove(id);
  }
}
