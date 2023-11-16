export const stageWidth = window.innerWidth * 0.7;
export const stageHeight = window.innerHeight * 0.8;

export const particleColors = ['red', 'green', 'blue'];

export const particlesMoveAttemptsLimit = 10;
export const initialMoveP = 0.005;

export const initialNumberOfParticles = 20;
export const initialParticleRadius = 80;

export const initialInteractionPowers = {
  'red': {'red': -1, 'green': 1, 'blue': 1},
  'green': {'red': 1, 'green': -1, 'blue': 1},
  'blue': {'red': 1, 'green': 1, 'blue': -1}
};

export const particlesMoveDelayMs = 10;
