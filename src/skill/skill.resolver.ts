import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Mutation(() => Skill)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createSkill(@Args('input') input: CreateSkillInput) {
    return this.skillService.create(input);
  }

  @Mutation(() => Skill)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  addSkillToHero(
    @Args('heroId', { type: () => ID }) heroId: string,
    @Args('input') input: CreateSkillInput,
  ) {
    return this.skillService.addSkillToHero(heroId, input);
  }

  @Mutation(() => Skill)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateSkill(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSkillInput,
  ) {
    return this.skillService.update(id, input);
  }

  @Mutation(() => Skill)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeSkill(@Args('id', { type: () => ID }) id: string) {
    return this.skillService.remove(id);
  }
}
