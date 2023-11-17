export const STAGE_WIDTH = window.innerWidth * 0.7;
export const STAGE_HEIGHT = window.innerHeight * 0.8;

export const PARTICLE_COLORS = ['red', 'green', 'blue'];

export const MOVE_ATTEMPTS_LIMIT = 10;
export const MOVE_P = 0.005;

export const INITIAL_NUMBER_OF_PARTICLES = 6;
export const INITIAL_PARTICLE_RADIUS = 70;

export const INTERACTION_POWERS = {
  'red': {'red': -1, 'green': 1, 'blue': 1},
  'green': {'red': 1, 'green': -1, 'blue': 1},
  'blue': {'red': 1, 'green': 1, 'blue': -1}
};

export const PARTICLES_MOVE_DELAY_MS = 10;
