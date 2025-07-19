import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SkillDetailService } from './skill-detail.service';
import { SkillDetail } from './entities/skill-detail.entity';
import { CreateSkillDetailInput } from './dto/create-skill-detail.input';
import { UpdateSkillDetailInput } from './dto/update-skill-detail.input';

@Resolver(() => SkillDetail)
export class SkillDetailResolver {
  constructor(private readonly service: SkillDetailService) {}

  @Mutation(() => SkillDetail)
  createSkillDetail(@Args('input') input: CreateSkillDetailInput) {
    return this.service.create(input);
  }

  @Mutation(() => [SkillDetail])
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
  updateSkillDetail(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSkillDetailInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => SkillDetail)
  removeSkillDetail(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}
