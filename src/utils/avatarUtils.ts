// Avatar image paths
const avatarPaths: string[] = [
  "/avatars/Avatar-1.png",
  "/avatars/Avatar-2.png",
  "/avatars/Avatar-3.png",
  "/avatars/Avatar-4.png",
  "/avatars/Avatar-5.png",
  "/avatars/Avatar-6.png",
  "/avatars/Avatar-7.png",
  "/avatars/Avatar-8.png",
  "/avatars/Avatar-9.png",
  "/avatars/Avatar-10.png",
  "/avatars/Avatar-11.png",
  "/avatars/Avatar-12.png",
  "/avatars/Avatar-13.png",
  "/avatars/Avatar-14.png",
  "/avatars/Avatar-15.png",
  "/avatars/Avatar-16.png",
  "/avatars/Avatar-17.png",
  "/avatars/Avatar-18.png",
  "/avatars/Avatar-19.png",
  "/avatars/Avatar-20.png",
  "/avatars/Avatar-21.png",
  "/avatars/Avatar-22.png",
  "/avatars/Avatar-23.png",
  "/avatars/Avatar-24.png",
  "/avatars/Avatar-25.png",
  "/avatars/Avatar-26.png",
  "/avatars/Avatar-27.png",
  "/avatars/Avatar-28.png",
  "/avatars/Avatar-29.png",
  "/avatars/Avatar-30.png",
  "/avatars/Avatar-31.png",
  "/avatars/Avatar-32.png",
  "/avatars/Avatar-33.png",
  "/avatars/Avatar-34.png",
  "/avatars/Avatar-35.png",
  "/avatars/Avatar-36.png",
];

/**
 * Get a random avatar image path
 *
 * @returns {string} A random avatar image path
 */
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatarPaths.length);
  return avatarPaths[randomIndex];
};

/**
 * Get a deterministic avatar based on a string (like a user ID or name)
 * This ensures the same avatar is always shown for the same input string
 *
 * @param {string} identifier - A unique string to base the avatar selection on
 * @returns {string} A deterministic avatar image path
 */
export const getAvatarByIdentifier = (
  identifier: string
): string => {
  // Generate a hash code from the string
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Use the absolute value of the hash to get a positive index
  const index = Math.abs(hash) % avatarPaths.length;
  return avatarPaths[index];
};
