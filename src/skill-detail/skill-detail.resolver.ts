import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SkillDetailService } from './skill-detail.service';
import { SkillDetail } from './entities/skill-detail.entity';
import { CreateSkillDetailInput } from './dto/create-skill-detail.input';
import { UpdateSkillDetailInput } from './dto/update-skill-detail.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => SkillDetail)
export class SkillDetailResolver {
  constructor(private readonly service: SkillDetailService) {}

  @Mutation(() => SkillDetail)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createSkillDetail(@Args('input') input: CreateSkillDetailInput) {
    return this.service.create(input);
  }

  @Mutation(() => [SkillDetail])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  addSkillDetailToSkill(
    @Args('skillId', { type: () => ID }) skillId: string,
    @Args({ name: 'input', type: () => [CreateSkillDetailInput] })
    input: CreateSkillDetailInput[],
  ) {
    return this.service.addSkillDetailsToSkill(skillId, input);
  }

  @Query(() => [SkillDetail], { name: 'skillDetails' })
  findAll() {
    return this.service.findAll();
  }

  @Query(() => SkillDetail, { name: 'skillDetail' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => SkillDetail)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateSkillDetail(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSkillDetailInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => SkillDetail)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateSkillDetailToSkill(
    @Args('skillId', { type: () => ID }) skillId: string,
    @Args('skillDetailId', { type: () => ID }) skillDetailId: string,
    @Args('input') input: UpdateSkillDetailInput,
  ) {
    return this.service.updateSkillDetailToSkill(skillId, skillDetailId, input);
  }

  @Mutation(() => SkillDetail)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeSkillDetail(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}
