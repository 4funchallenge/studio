import type { LevelMessage } from "@/ai/flows/personalized-level-messages";

export const userMessages = [
  "Happy Birthday! Hope you have a great day.",
  "Can't wait to celebrate with you!",
  "You're the best!",
  "Let's play some games!",
  "Remember that time we went to the arcade?",
];

export const levelMessages: LevelMessage[] = [
  { message: "Wow, you're a natural at this!", imageUrl: 'https://picsum.photos/seed/1/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "Incredible! On to the next one.", imageUrl: 'https://picsum.photos/seed/2/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "You've got a great memory!", imageUrl: 'https://picsum.photos/seed/3/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "Amazing work, you're on fire!", imageUrl: 'https://picsum.photos/seed/4/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "Level cleared! Nothing can stop you.", imageUrl: 'https://picsum.photos/seed/5/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
];
