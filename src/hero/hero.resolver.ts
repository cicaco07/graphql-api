import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { HeroService } from './hero.service';
import { Hero } from './entities/hero.entity';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => Hero)
export class HeroResolver {
  constructor(private readonly heroService: HeroService) {}

  @Mutation(() => Hero)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createHero(@Args('input') input: CreateHeroInput) {
    return this.heroService.create(input);
  }

  @Mutation(() => Hero)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createHeroWithSkill(@Args('input') input: CreateHeroInput) {
    return this.heroService.createHeroWithSkill(input);
  }

  @Mutation(() => Hero)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateHero(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateHeroInput,
  ) {
    return this.heroService.update(id, input);
  }

  @Mutation(() => Hero)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeHero(@Args('id', { type: () => ID }) id: string) {
    return this.heroService.remove(id);
  }
}
