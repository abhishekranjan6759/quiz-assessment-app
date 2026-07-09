// Category definitions for Social Type quiz

export const amiable = [
  'Good-natured', 'Docile', 'Loyal', 'Even-tempered', 'Willing', 'Agreeable',
  'Obliging', 'Sympathetic', 'Tolerant', 'Respectful', 'Generous', 'Considerate',
  'Kind', 'Patient', 'Trusting', 'Peaceful', 'Cordial', 'Lenient', 'Satisfied', 'Companionable'
];

export const driver = [
  'Aggressive', 'Dogged', 'Determined', 'Strong-willed', 'Confident', 'Assertive',
  'Restless', 'Persistent', 'Competitive', 'Unconquerable', 'Brave', 'Argumentative',
  'Self-reliant', 'Adventurous', 'Vigorous', 'Decisive', 'Outspoken', 'Audacious'
];

export const analytical = [
  'Cautious', 'Precise', 'Disciplined', 'Accurate', 'Fussy', 'Timid',
  'Nonchalant', 'Moderate', 'Controlled', 'Conventional'
];

export const expressive = [
  'Persuasive', 'Open-minded', 'Charming', 'High-spirited', 'Animated', 'Cheerful',
  'Spontaneous', 'Pioneering', 'Jovial', 'Influential', 'Optimistic', 'Inspiring',
  'Adaptable', 'Lighthearted', 'Positive', 'Receptive', 'Good mixer', 'Talkative',
  'Popular', 'Polished'
];

// Categorize Social Type answer
export const categorizeSocialType = (answer) => {
  if (amiable.includes(answer)) return 'Amiable';
  if (driver.includes(answer)) return 'Driver';
  if (analytical.includes(answer)) return 'Analytical';
  if (expressive.includes(answer)) return 'Expressive';
  return null;
};

// Brain Dominance categorization logic
// First option in each question = Left Brain, Second option = Right Brain
export const categorizeBrainDominance = (answers) => {
  let leftBrain = 0;
  let rightBrain = 0;

  answers.forEach((answer, index) => {
    // The questions are structured so that the first option is always Left Brain
    // and the second option is always Right Brain
    if (answer === 0) {
      leftBrain++;
    } else if (answer === 1) {
      rightBrain++;
    }
  });

  return { leftBrain, rightBrain };
};

// VARK categorization logic
export const categorizeVARK = (answer) => {
  // Visual indicators
  if (answer.includes("Youtube") || answer.includes("Ted Talks") ||
      answer.includes("illustrations") || answer.includes("illustrative videos") ||
      answer.includes("Videos") || answer.includes("pictures") ||
      answer.includes("Picture") || answer.includes("video") ||
      answer.includes("Watch") || answer.includes("movie") ||
      answer.includes("Look at") || answer.includes("Diagrams") ||
      answer.includes("charts") || answer.includes("visual")) {
    return 'Visual';
  }
  
  // Auditory indicators
  if (answer.includes("Podcasts") || answer.includes("Audiobooks") ||
      answer.includes("audiobook") || answer.includes("explains") ||
      answer.includes("Spell it out loud") || answer.includes("sounds right") ||
      answer.includes("Say the word") || answer.includes("Listen") ||
      answer.includes("Discuss") || answer.includes("spoken") ||
      answer.includes("Audio") || answer.includes("Loud noises")) {
    return 'Auditory';
  }
  
  // Reading/Writing indicators
  if (answer.includes("Books") || answer.includes("eBooks") ||
      answer.includes("Newspapers") || answer.includes("Reading") ||
      answer.includes("Writing") || answer.includes("Highlighting") ||
      answer.includes("novel") || answer.includes("Read") ||
      answer.includes("Write it down") || answer.includes("reviews") ||
      answer.includes("Handouts") || answer.includes("written") ||
      answer.includes("instructions")) {
    return 'Reading/Writing';
  }
  
  // Kinesthetic indicators
  if (answer.includes("Social Gatherings") || answer.includes("mindmap") ||
      answer.includes("Puzzles") || answer.includes("Challenges") ||
      answer.includes("Trace the letters") || answer.includes("finger spelling") ||
      answer.includes("being with") || answer.includes("Test-drive") ||
      answer.includes("Exercise") || answer.includes("Practice") ||
      answer.includes("uncomfortable chair") || answer.includes("People walking") ||
      answer.includes("figure it out") || answer.includes("Demonstrations") ||
      answer.includes("practical")) {
    return 'Kinesthetic';
  }
  
  return null;
};

// Motivation Type categorization
// First option (index 0) = Intrinsic, Second option (index 1) = Extrinsic
export const categorizeMotivation = (answers) => {
  let intrinsic = 0;
  let extrinsic = 0;

  answers.forEach((answer) => {
    if (answer === 0) {
      intrinsic++;
    } else if (answer === 1) {
      extrinsic++;
    }
  });

  return { intrinsic, extrinsic };
};

// Happiness scoring
export const scoreHappiness = (answers) => {
  const scoreMapping = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  const totalScore = answers.reduce(
    (total, answer) => total + (scoreMapping[answer] || 0),
    0
  );
  const maxScore = answers.length * 5;
  const percentage = (totalScore / maxScore) * 100;

  return { totalScore, maxScore, percentage };
};