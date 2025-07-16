// Test avatar system integration
const seedPersonas = require('./src/data/seedPersonas.ts');

console.log('Testing avatar system...');

// Check if all personas have preferredAvatar paths
const personasWithoutPreferredAvatar = seedPersonas.SEED_PERSONA_TEMPLATES.filter(p => !p.preferredAvatar);
if (personasWithoutPreferredAvatar.length === 0) {
  console.log('✅ All personas have preferredAvatar paths');
} else {
  console.log('❌ Missing preferredAvatar for:', personasWithoutPreferredAvatar.map(p => p.username));
}

// Check if all paths follow the correct format
const invalidAvatarPaths = seedPersonas.SEED_PERSONA_TEMPLATES.filter(p => 
  !p.preferredAvatar || !p.preferredAvatar.match(/^\/avatars\/Avatar-\d+\.png$/)
);
if (invalidAvatarPaths.length === 0) {
  console.log('✅ All avatar paths follow correct format');
} else {
  console.log('❌ Invalid avatar paths:', invalidAvatarPaths.map(p => ({ username: p.username, path: p.preferredAvatar })));
}

// Check if avatar and preferredAvatar are the same
const mismatchedAvatars = seedPersonas.SEED_PERSONA_TEMPLATES.filter(p => p.avatar !== p.preferredAvatar);
if (mismatchedAvatars.length === 0) {
  console.log('✅ All personas have matching avatar and preferredAvatar');
} else {
  console.log('❌ Mismatched avatar/preferredAvatar:', mismatchedAvatars.map(p => ({ 
    username: p.username, 
    avatar: p.avatar, 
    preferredAvatar: p.preferredAvatar 
  })));
}

console.log('\nAvatar system test completed!');