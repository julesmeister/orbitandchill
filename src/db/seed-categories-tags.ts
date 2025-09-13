import { initializeDatabase } from './index';
import { initializeDefaultCategories, createCategory } from './services/categoryService';
import { TagService } from './services/tagService';

const categoryData = [
  {
    name: 'Natal Chart Analysis',
    description: 'Birth chart interpretation, planetary placements, and personal astrology insights',
    color: '#6bdbff',
    icon: 'chart',
    sortOrder: 1
  },
  {
    name: 'Transits & Predictions',
    description: 'Current planetary movements, forecasts, and timing predictions',
    color: '#f2e356',
    icon: 'calendar',
    sortOrder: 2
  },
  {
    name: 'Chart Reading Help',
    description: 'Get help interpreting your chart from the community',
    color: '#51bd94',
    icon: 'help',
    sortOrder: 3
  },
  {
    name: 'Synastry & Compatibility',
    description: 'Relationship astrology, compatibility analysis, and love connections',
    color: '#ff91e9',
    icon: 'heart',
    sortOrder: 4
  },
  {
    name: 'Mundane Astrology',
    description: 'World events, political astrology, and collective influences',
    color: '#19181a',
    icon: 'globe',
    sortOrder: 5
  },
  {
    name: 'Learning Resources',
    description: 'Educational content, tutorials, and astrology study materials',
    color: '#6bdbff',
    icon: 'book',
    sortOrder: 6
  },
  {
    name: 'General Discussion',
    description: 'Open discussions about astrology and related topics',
    color: '#51bd94',
    icon: 'chat',
    sortOrder: 7
  }
];

const tagData = [
  // Planets
  { name: 'sun', description: 'Sun placements and solar astrology', isPopular: true },
  { name: 'moon', description: 'Moon phases, lunar astrology, and emotions', isPopular: true },
  { name: 'mercury', description: 'Mercury placements and communication', isPopular: true },
  { name: 'venus', description: 'Venus placements, love, and beauty', isPopular: true },
  { name: 'mars', description: 'Mars placements, action, and energy', isPopular: true },
  { name: 'jupiter', description: 'Jupiter placements, expansion, and luck', isPopular: true },
  { name: 'saturn', description: 'Saturn placements, discipline, and lessons', isPopular: true },
  { name: 'uranus', description: 'Uranus placements, innovation, and rebellion' },
  { name: 'neptune', description: 'Neptune placements, dreams, and spirituality' },
  { name: 'pluto', description: 'Pluto placements, transformation, and power' },
  
  // Zodiac Signs
  { name: 'aries', description: 'Aries sign and energy', isPopular: true },
  { name: 'taurus', description: 'Taurus sign and energy', isPopular: true },
  { name: 'gemini', description: 'Gemini sign and energy', isPopular: true },
  { name: 'cancer', description: 'Cancer sign and energy', isPopular: true },
  { name: 'leo', description: 'Leo sign and energy', isPopular: true },
  { name: 'virgo', description: 'Virgo sign and energy', isPopular: true },
  { name: 'libra', description: 'Libra sign and energy', isPopular: true },
  { name: 'scorpio', description: 'Scorpio sign and energy', isPopular: true },
  { name: 'sagittarius', description: 'Sagittarius sign and energy', isPopular: true },
  { name: 'capricorn', description: 'Capricorn sign and energy', isPopular: true },
  { name: 'aquarius', description: 'Aquarius sign and energy', isPopular: true },
  { name: 'pisces', description: 'Pisces sign and energy', isPopular: true },
  
  // Houses
  { name: '1st-house', description: '1st house: Self, identity, appearance' },
  { name: '2nd-house', description: '2nd house: Money, values, possessions' },
  { name: '3rd-house', description: '3rd house: Communication, siblings, learning' },
  { name: '4th-house', description: '4th house: Home, family, roots' },
  { name: '5th-house', description: '5th house: Creativity, romance, children' },
  { name: '6th-house', description: '6th house: Work, health, daily routine' },
  { name: '7th-house', description: '7th house: Partnerships, marriage, others', isPopular: true },
  { name: '8th-house', description: '8th house: Transformation, shared resources' },
  { name: '9th-house', description: '9th house: Philosophy, travel, higher learning' },
  { name: '10th-house', description: '10th house: Career, reputation, public image' },
  { name: '11th-house', description: '11th house: Friends, groups, hopes, dreams' },
  { name: '12th-house', description: '12th house: Spirituality, subconscious, karma' },
  
  // Astrological Concepts
  { name: 'natal-chart', description: 'Birth chart analysis and interpretation', isPopular: true },
  { name: 'transits', description: 'Current planetary movements and their effects', isPopular: true },
  { name: 'synastry', description: 'Relationship compatibility analysis', isPopular: true },
  { name: 'aspects', description: 'Planetary aspects and their meanings', isPopular: true },
  { name: 'houses', description: 'Astrological houses and their significance', isPopular: true },
  { name: 'stellium', description: 'Three or more planets in same sign/house', isPopular: true },
  { name: 'retrograde', description: 'Retrograde planetary motion', isPopular: true },
  { name: 'mercury-retrograde', description: 'Mercury retrograde periods and effects', isPopular: true },
  { name: 'full-moon', description: 'Full moon phases and energy' },
  { name: 'new-moon', description: 'New moon phases and manifestation' },
  { name: 'eclipse', description: 'Solar and lunar eclipses' },
  { name: 'void-moon', description: 'Void of course moon periods' },
  
  // Life Areas
  { name: 'relationships', description: 'Love, partnership, and relationship astrology', isPopular: true },
  { name: 'career', description: 'Career astrology and life path guidance', isPopular: true },
  { name: 'compatibility', description: 'Relationship and friendship compatibility', isPopular: true },
  { name: 'personality', description: 'Personality traits and characteristics' },
  { name: 'spirituality', description: 'Spiritual growth and awakening' },
  { name: 'healing', description: 'Emotional and spiritual healing' },
  { name: 'manifestation', description: 'Using astrology for manifestation' },
  { name: 'timing', description: 'Astrological timing and electional astrology' },
  
  // Chart Types
  { name: 'composite-chart', description: 'Composite charts for relationships' },
  { name: 'progressed-chart', description: 'Progressed charts and evolution' },
  { name: 'solar-return', description: 'Solar return charts and yearly forecasts' },
  { name: 'lunar-return', description: 'Lunar return charts and monthly cycles' },
  
  // Techniques
  { name: 'interpretation', description: 'Chart interpretation techniques and tips' },
  { name: 'prediction', description: 'Astrological prediction methods' },
  { name: 'electional', description: 'Electional astrology for timing events' },
  { name: 'horary', description: 'Horary astrology for specific questions' },
  { name: 'mundane', description: 'Mundane astrology and world events' }
];

async function seedCategoriesAndTags() {
  try {
    console.log('🌱 Seeding categories and tags...');
    await initializeDatabase();

    // Seed categories
    console.log('Creating categories...');
    const categories = [];
    for (const categoryInfo of categoryData) {
      const result = await createCategory(categoryInfo);
      const category = result.data;
      if (category) {
        categories.push(category);
        console.log(`✅ Created category: ${category.name}`);
      }
    }

    // Seed tags
    console.log('Creating tags...');
    const tags = [];
    for (const tagInfo of tagData) {
      const tag = await TagService.createTag({
        name: tagInfo.name,
        description: tagInfo.description
      });
      
      // Set popular status and initial usage count
      if (tagInfo.isPopular) {
        await TagService.incrementUsageCount(tag.id);
        await TagService.incrementUsageCount(tag.id); // 2+ to make it popular
      }
      
      tags.push(tag);
      console.log(`✅ Created tag: ${tag.name}`);
    }

    // Update popular status
    await TagService.updatePopularStatus();

    console.log(`✅ Created ${categories.length} categories`);
    console.log(`✅ Created ${tags.length} tags`);
    console.log('🎉 Categories and tags seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedCategoriesAndTags()
    .then(() => {
      console.log('🌟 Categories and tags seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedCategoriesAndTags };