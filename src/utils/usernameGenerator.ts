/* eslint-disable @typescript-eslint/no-unused-vars */

const ADJECTIVES = [
  "Cosmic", "Stellar", "Mystic", "Lunar", "Solar", "Astral", "Celestial",
  "Divine", "Ethereal", "Radiant", "Serene", "Mystical", "Enchanted",
  "Starlight", "Moonbeam", "Supernova", "Galactic", "Nebular", "Orbital", "Planetary"
];

const NOUNS = [
  "Seeker", "Wanderer", "Observer", "Dreamer", "Voyager", "Explorer",
  "Sage", "Oracle", "Mystic", "Stargazer", "Moonchild", "Starseed",
  "Lightbringer", "Pathfinder", "Navigator", "Guardian", "Keeper",
  "Whisper", "Echo", "Soul"
];

export const generateAnonymousName = (): string => {
  const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;

  return `${randomAdjective} ${randomNoun} ${randomNumber}`;
};

export const getUserInitials = (displayName: string): string => {
  return displayName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
};