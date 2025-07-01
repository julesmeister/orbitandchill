/* eslint-disable @typescript-eslint/no-unused-vars */

export interface ArcanaInfo {
  name: string;
  color: string;
  description: string;
}

/**
 * Tarot Major Arcana information with subtle colors and descriptions
 * Colors are muted and professional while maintaining mystical essence
 */
export const getArcanaInfo = (number: number): ArcanaInfo => {
  const arcana: Record<number, ArcanaInfo> = {
    1: {
      name: "Magician",
      color: "#f2e356",
      description: "Willpower, skill, manifestation",
    },
    2: {
      name: "High Priestess",
      color: "#6bdbff",
      description: "Intuition, mystery, hidden knowledge",
    },
    3: {
      name: "Empress",
      color: "#4ade80",
      description: "Fertility, abundance, nurturing",
    },
    4: {
      name: "Emperor",
      color: "#f0e3ff",
      description: "Authority, structure, leadership",
    },
    5: {
      name: "Hierophant",
      color: "#6bdbff",
      description: "Tradition, teaching, guidance",
    },
    6: {
      name: "Lovers",
      color: "#ff91e9",
      description: "Love, harmony, choice",
    },
    7: {
      name: "Chariot",
      color: "#f2e356",
      description: "Victory, determination, control",
    },
    8: {
      name: "Strength",
      color: "#4ade80",
      description: "Inner strength, courage, patience",
    },
    9: {
      name: "Hermit",
      color: "#6bdbff",
      description: "Soul searching, guidance, wisdom",
    },
    10: {
      name: "Wheel of Fortune",
      color: "#f0e3ff",
      description: "Cycles, destiny, good fortune",
    },
    11: {
      name: "Justice",
      color: "#6bdbff",
      description: "Balance, truth, fairness",
    },
    12: {
      name: "Hanged Man",
      color: "#ff91e9",
      description: "Sacrifice, new perspective, wisdom",
    },
    13: {
      name: "Death",
      color: "#e5e7eb",
      description: "Transformation, endings, rebirth",
    },
    14: {
      name: "Temperance",
      color: "#6bdbff",
      description: "Balance, moderation, healing",
    },
    15: {
      name: "Devil",
      color: "#ff91e9",
      description: "Bondage, materialism, temptation",
    },
    16: {
      name: "Tower",
      color: "#ff91e9",
      description: "Sudden change, revelation, liberation",
    },
    17: {
      name: "Star",
      color: "#f0e3ff",
      description: "Hope, inspiration, spiritual guidance",
    },
    18: {
      name: "Moon",
      color: "#6bdbff",
      description: "Illusion, intuition, subconscious",
    },
    19: {
      name: "Sun",
      color: "#f2e356",
      description: "Joy, success, vitality",
    },
    20: {
      name: "Judgement",
      color: "#ff91e9",
      description: "Rebirth, awakening, calling",
    },
    21: {
      name: "World",
      color: "#4ade80",
      description: "Completion, accomplishment, fulfillment",
    },
    22: {
      name: "Fool",
      color: "#4ade80",
      description: "New beginnings, innocence, potential",
    },
  };
  
  return arcana[number] || { name: "Unknown", color: "#f3f4f6", description: "Undefined energy" };
};

/**
 * Get all arcana information as an array
 */
export const getAllArcana = (): Array<{ number: number; info: ArcanaInfo }> => {
  const result = [];
  for (let i = 1; i <= 22; i++) {
    result.push({ number: i, info: getArcanaInfo(i) });
  }
  return result;
};

/**
 * Get arcana by name (case-insensitive)
 */
export const getArcanaByName = (name: string): { number: number; info: ArcanaInfo } | null => {
  for (let i = 1; i <= 22; i++) {
    const info = getArcanaInfo(i);
    if (info.name.toLowerCase() === name.toLowerCase()) {
      return { number: i, info };
    }
  }
  return null;
};