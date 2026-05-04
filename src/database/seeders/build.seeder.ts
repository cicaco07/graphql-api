import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Build } from '../../build/schemas/build.schema';
import { Hero } from '../../hero/schemas/hero.schema';
import { Item } from '../../item/schemas/item.schema';
import { Emblem } from '../../emblem/schemas/emblem.schema';
import { BattleSpell } from '../../battle-spell/schemas/battle-spell.schema';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class BuildSeeder {
  private readonly logger = new Logger(BuildSeeder.name);

  constructor(
    @InjectModel(Build.name) private buildModel: Model<Build>,
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Emblem.name) private emblemModel: Model<Emblem>,
    @InjectModel(BattleSpell.name)
    private battleSpellModel: Model<BattleSpell>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async seedBuilds(): Promise<void> {
    try {
      const existingBuildsCount = await this.buildModel.countDocuments();

      if (existingBuildsCount > 0) {
        this.logger.log('Builds already exist, skipping build seeding');
        return;
      }

      this.logger.log('Starting build seeding...');

      // Get existing data
      const heroes = await this.heroModel.find().limit(10).exec();
      const items = await this.itemModel.find().limit(20).exec();
      const emblems = await this.emblemModel.find().limit(10).exec();
      const battleSpells = await this.battleSpellModel.find().limit(5).exec();
      const users = await this.userModel.find().exec();

      if (
        heroes.length === 0 ||
        items.length === 0 ||
        emblems.length === 0 ||
        battleSpells.length === 0 ||
        users.length === 0
      ) {
        this.logger.warn(
          'Required data not found. Please seed heroes, items, emblems, battle spells, and users first.',
        );
        return;
      }

      const roles = ['Exp Lane', 'Gold Lane', 'Roam', 'Mid Lane', 'Jungle'];

      const buildTemplates = [
        {
          name: 'Build Mage Burst Damage',
          role: 'Mid Lane',
          description:
            'Build untuk mage dengan fokus burst damage tinggi. Cocok untuk menghancurkan musuh dalam sekejap dengan kombinasi skill yang tepat.',
        },
        {
          name: 'Build Marksman Hyper Carry',
          role: 'Gold Lane',
          description:
            'Build marksman untuk late game dengan damage maksimal. Prioritas farming dan scaling untuk menjadi carry tim.',
        },
        {
          name: 'Build Tank Roamer Agresif',
          role: 'Roam',
          description:
            'Build tank roamer yang agresif dengan fokus initiate dan crowd control. Cocok untuk memulai team fight.',
        },
        {
          name: 'Build Fighter Exp Lane Sustain',
          role: 'Exp Lane',
          description:
            'Build fighter dengan sustain tinggi untuk bertahan di exp lane. Kombinasi defense dan damage yang seimbang.',
        },
        {
          name: 'Build Assassin Jungle Gank',
          role: 'Jungle',
          description:
            'Build assassin jungle dengan fokus ganking dan burst damage. Cocok untuk memburu hero musuh yang lemah.',
        },
        {
          name: 'Build Mage Support Utility',
          role: 'Mid Lane',
          description:
            'Build mage dengan fokus utility dan crowd control. Membantu tim dengan disable dan poke damage.',
        },
        {
          name: 'Build Marksman Critical Strike',
          role: 'Gold Lane',
          description:
            'Build marksman dengan fokus critical strike dan attack speed. Damage konsisten untuk team fight.',
        },
        {
          name: 'Build Tank Roamer Defensive',
          role: 'Roam',
          description:
            'Build tank roamer defensif dengan fokus melindungi carry. Prioritas HP dan magic resistance.',
        },
        {
          name: 'Build Fighter Exp Lane Damage',
          role: 'Exp Lane',
          description:
            'Build fighter dengan damage tinggi untuk dominasi exp lane. Cocok untuk split push dan duel.',
        },
        {
          name: 'Build Assassin Jungle Invade',
          role: 'Jungle',
          description:
            'Build assassin untuk invade jungle musuh. Fokus mobility dan damage untuk steal buff.',
        },
        {
          name: 'Build Mage Poke Damage',
          role: 'Mid Lane',
          description:
            'Build mage dengan fokus poke damage dari jarak jauh. Cocok untuk siege dan harass musuh.',
        },
        {
          name: 'Build Marksman Penetration',
          role: 'Gold Lane',
          description:
            'Build marksman dengan fokus penetration untuk melawan tank. Efektif melawan hero dengan defense tinggi.',
        },
        {
          name: 'Build Tank Support Healer',
          role: 'Roam',
          description:
            'Build tank support dengan kemampuan heal dan shield. Fokus menjaga carry tetap hidup.',
        },
        {
          name: 'Build Fighter Hybrid Damage',
          role: 'Exp Lane',
          description:
            'Build fighter dengan kombinasi physical dan magic damage. Sulit diprediksi oleh musuh.',
        },
        {
          name: 'Build Assassin Reap Jungle',
          role: 'Jungle',
          description:
            'Build assassin dengan fokus reap dan execute. Cocok untuk membersihkan sisa HP musuh.',
        },
        {
          name: 'Build Mage Area Damage',
          role: 'Mid Lane',
          description:
            'Build mage dengan fokus area damage untuk team fight. Efektif melawan grup musuh.',
        },
        {
          name: 'Build Marksman Lifesteal',
          role: 'Gold Lane',
          description:
            'Build marksman dengan lifesteal tinggi untuk sustain. Cocok untuk duel dan bertahan lama.',
        },
        {
          name: 'Build Tank Roamer Crowd Control',
          role: 'Roam',
          description:
            'Build tank dengan fokus crowd control maksimal. Cocok untuk lock down hero musuh.',
        },
        {
          name: 'Build Fighter Exp Lane Anti Mage',
          role: 'Exp Lane',
          description:
            'Build fighter dengan magic resistance tinggi. Efektif melawan hero mage di exp lane.',
        },
        {
          name: 'Build Assassin Jungle One Shot',
          role: 'Jungle',
          description:
            'Build assassin dengan damage maksimal untuk one shot combo. Cocok untuk membunuh carry musuh.',
        },
      ];

      const builds: any[] = [];

      for (let i = 0; i < 20; i++) {
        const template = buildTemplates[i];
        const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Select random items (4-6 items)
        const itemCount = 4 + Math.floor(Math.random() * 3);
        const selectedItems: any[] = [];
        const usedItemIndices = new Set();

        for (let j = 0; j < itemCount && j < items.length; j++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * items.length);
          } while (usedItemIndices.has(randomIndex));

          usedItemIndices.add(randomIndex);
          selectedItems.push({
            item: items[randomIndex]._id,
            order: j + 1,
          });
        }

        // Select random emblems (1-3 emblems)
        const emblemCount = 1 + Math.floor(Math.random() * 3);
        const selectedEmblems: any[] = [];
        const usedEmblemIndices = new Set();

        for (let j = 0; j < emblemCount && j < emblems.length; j++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * emblems.length);
          } while (usedEmblemIndices.has(randomIndex));

          usedEmblemIndices.add(randomIndex);
          selectedEmblems.push(emblems[randomIndex]._id);
        }

        // Select 1-2 battle spells
        const spellCount = 1 + Math.floor(Math.random() * 2);
        const selectedSpells: any[] = [];
        const usedSpellIndices = new Set();

        for (let j = 0; j < spellCount && j < battleSpells.length; j++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * battleSpells.length);
          } while (usedSpellIndices.has(randomIndex));

          usedSpellIndices.add(randomIndex);
          selectedSpells.push(battleSpells[randomIndex]._id);
        }

        // Determine if official (20% chance for super_admin users)
        const isOfficial =
          randomUser.role === 'super_admin' && Math.random() < 0.2;

        builds.push({
          name: template.name,
          role: template.role,
          description: template.description,
          hero: randomHero._id,
          items: selectedItems,
          emblems: selectedEmblems,
          battle_spells: selectedSpells,
          user: randomUser._id,
          is_official: isOfficial,
        });
      }

      await this.buildModel.insertMany(builds);

      this.logger.log(`Successfully seeded ${builds.length} builds`);
      this.logger.log('Build seeding completed');

      // Log summary
      const officialCount = builds.filter((b) => b.is_official).length;
      this.logger.log(`- Official builds: ${officialCount}`);
      this.logger.log(`- Community builds: ${builds.length - officialCount}`);
    } catch (error) {
      this.logger.error('Error seeding builds:', error);
      throw error;
    }
  }

  async clearBuilds(): Promise<void> {
    try {
      this.logger.log('Clearing all builds...');
      await this.buildModel.deleteMany({});
      this.logger.log('All builds cleared successfully');
    } catch (error) {
      this.logger.error('Error clearing builds:', error);
      throw error;
    }
  }

  async reseedBuilds(): Promise<void> {
    try {
      await this.clearBuilds();
      await this.seedBuilds();
    } catch (error) {
      this.logger.error('Error in build reseeding:', error);
      throw error;
    }
  }
}
