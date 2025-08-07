import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Mutation(() => Skill)
  createSkill(@Args('input') input: CreateSkillInput) {
    return this.skillService.create(input);
  }

  @Mutation(() => Skill)
  addSkillToHero(
    @Args('heroId', { type: () => ID }) heroId: string,
    @Args('input') input: CreateSkillInput,
  ) {
    return this.skillService.addSkillToHero(heroId, input);
  }

  @Mutation(() => Skill)
  updateHeroWithSkills(
    @Args('fromHeroId', { type: () => ID }) fromHeroId: string,
    @Args('toHeroId', { type: () => ID }) toHeroId: string,
    @Args('skillId', { type: () => ID }) skillId: string,
    @Args('input') input: CreateSkillInput,
  ) {
    return this.skillService.updateHeroWithSkills(
      fromHeroId,
      toHeroId,
      skillId,
      input,
    );
  }

  @Query(() => [Skill], { name: 'skills' })
  findAll() {
    return this.skillService.findAll();
  }

  @Query(() => Skill, { name: 'skill' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.skillService.findById(id);
  }

  @Mutation(() => Skill)
  updateSkill(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSkillInput,
  ) {
    return this.skillService.update(id, input);
  }

  @Mutation(() => Skill)
  removeSkill(@Args('id', { type: () => ID }) id: string) {
    return this.skillService.remove(id);
  }
}
