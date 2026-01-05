
// Fix: Escaped internal backticks in template literals to prevent premature closing of strings
export const getQuestFlavor = (day: number, userName: string): string => {
  const flavors = [
    `Ready for Day ${day}, ${userName}-senpai? Let's give it our all! (◕‿◕✿)`,
    `Day ${day} is here! You're doing amazing, ${userName}! (｡♥‿♥｡)`,
    `Another day, another step forward! Ganbatte, ${userName}-chan! (*^ω^*)`,
    `Level ${day} start! Don't forget to drink water! (´｡• ᵕ •｡\`) ♡`,
    `Wow, Day ${day} already? You're a hero in the making! ٩(◕‿◕)۶`,
    `Keep that spirit up! Day ${day} won't know what hit it! (✧ω✧)`,
    `I'm cheering for you so hard today, ${userName}! (人◕ω◕)`,
    `One day at a time, Senpai! You're shining! (´ ε \` )♡`
  ];
  return flavors[day % flavors.length];
};

// Fix: Escaped internal backticks in template literals to prevent premature closing of strings
export const getEncouragement = (userName: string, habit: string): string => {
  const messages = [
    `Sugoi! You finished ${habit}! (◕‿◕✿)`,
    `Yay! ${habit} is complete! (｡♥‿♥｡)`,
    `Excellent work on ${habit}, Senpai! (*^ω^*)`,
    `You're on fire! ${habit} checked! (´｡• ᵕ •｡\`) ♡`,
    `So proud of you for doing ${habit}! ٩(◕‿◕)۶`,
    `Habit: ${habit}... STATUS: CLEARED! (✧ω✧)`,
    `That's my Senpai! ${habit} is done! (人◕ω◕)`,
    `One step closer to greatness! Nice ${habit}! (´ ε \` )♡`
  ];
  const hash = habit.length + userName.length;
  return messages[hash % messages.length];
};
