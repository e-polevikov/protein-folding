export const STAGE_WIDTH = window.innerWidth * 0.7;
export const STAGE_HEIGHT = window.innerHeight * 0.8;

export const PARTICLE_COLORS = ['red', 'green', 'blue'];
export const STROKE_PARTICLE_COLOR = 'black';

export const INITIAL_NUMBER_OF_PARTICLES = 9;
export const INITIAL_PARTICLE_RADIUS = 45;
export const ROTATION_ANGLE = 0.01;

export const INTERACTION_POWERS = {
  'red': {'red': -1, 'green': 1, 'blue': 1},
  'green': {'red': 1, 'green': -1, 'blue': 1},
  'blue': {'red': 1, 'green': 1, 'blue': -1}
};
