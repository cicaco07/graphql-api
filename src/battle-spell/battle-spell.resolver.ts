import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BattleSpellService } from './battle-spell.service';
import { BattleSpell } from './entities/battle-spell.entity';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';

@Resolver(() => BattleSpell)
export class BattleSpellResolver {
  constructor(private readonly battleSpellService: BattleSpellService) {}

  @Mutation(() => BattleSpell)
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
  updateBattleSpell(
    @Args('id') id: string,
    @Args('updateBattleSpellInput')
    updateBattleSpellInput: UpdateBattleSpellInput,
  ) {
    return this.battleSpellService.update(id, updateBattleSpellInput);
  }

  @Mutation(() => Boolean)
  removeBattleSpell(@Args('id') id: string) {
    return this.battleSpellService.remove(id);
  }
}
