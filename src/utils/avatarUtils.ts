// FigJam-style avatar colors
const AVATAR_COLORS = [
  { bg: '#8774ff', name: 'Purple' },
  { bg: '#ff6f91', name: 'Pink' },
  { bg: '#ffa726', name: 'Orange' },
  { bg: '#66bb6a', name: 'Green' },
  { bg: '#42a5f5', name: 'Blue' },
  { bg: '#ab47bc', name: 'Violet' },
  { bg: '#ec407a', name: 'Magenta' },
  { bg: '#26c6da', name: 'Cyan' },
  { bg: '#ffca28', name: 'Yellow' },
  { bg: '#78909c', name: 'Slate' },
];

// Random fun initials for anonymous users
const RANDOM_INITIALS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

// Simple hash function to convert string to number
function hashString(str: string | undefined): number {
  if (!str) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get or create user ID from localStorage
export function getUserId(): string {
  const STORAGE_KEY = 'portfolio_user_id';
  
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Generate a new random user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
}

// Get avatar color based on user ID
export function getAvatarColor(userId: string | undefined): string {
  if (!userId) {
    return AVATAR_COLORS[0].bg; // Default to first color
  }
  const hash = hashString(userId);
  const colorIndex = hash % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex].bg;
}

// Get avatar initial based on user ID
export function getAvatarInitial(userId: string | undefined): string {
  if (!userId) {
    return 'V'; // Default to 'V' for Visitor
  }
  const hash = hashString(userId);
  const initialIndex = hash % RANDOM_INITIALS.length;
  return RANDOM_INITIALS[initialIndex];
}

// Get complete avatar info
export function getAvatarInfo(userId: string | undefined) {
  return {
    color: getAvatarColor(userId),
    initial: getAvatarInitial(userId),
    userId: userId || 'unknown',
  };
}
