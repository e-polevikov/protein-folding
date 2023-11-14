export const stageWidth = window.innerWidth * 0.7;
export const stageHeight = window.innerHeight * 0.8;

export const initialParticleRadius = 20;
export const initialNumberOfParticles = 3;

export const particleColors = ['red', 'green', 'blue'];
export const initialInteractionPowers = {
  'red': {'red': 2, 'green': 5, 'blue': 4},
  'green': {'red': 5, 'green': 1, 'blue': -1},
  'blue': {'red': 4, 'green': -1, 'blue': -1}
};

// Probability to move a particle if total energy
// increases after the particle is moved randomly
export const initialP = 0.01;
export const maxAttemptsToMoveParticleRandomly = 10;

// Delay between rerendering of protein particles
export const iterationDelayMs = 10;
