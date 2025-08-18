import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BattleSpellService } from './battle-spell.service';
import { BattleSpell } from './entities/battle-spell.entity';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => BattleSpell)
export class BattleSpellResolver {
  constructor(private readonly battleSpellService: BattleSpellService) {}

  @Mutation(() => BattleSpell)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createBattleSpell(
    @Args('createBattleSpellInput')
    createBattleSpellInput: CreateBattleSpellInput,
  ) {
    return this.battleSpellService.create(createBattleSpellInput);
  }

  @Query(() => [BattleSpell], { name: 'battleSpells' })
  findAll() {
    return this.battleSpellService.findAll();
  }

  @Query(() => BattleSpell, { name: 'battleSpell' })
  findOne(@Args('id') id: string) {
    return this.battleSpellService.findOne(id);
  }

  @Mutation(() => BattleSpell)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateBattleSpell(
    @Args('id') id: string,
    @Args('updateBattleSpellInput')
    updateBattleSpellInput: UpdateBattleSpellInput,
  ) {
    return this.battleSpellService.update(id, updateBattleSpellInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeBattleSpell(@Args('id') id: string) {
    return this.battleSpellService.remove(id);
  }
}
