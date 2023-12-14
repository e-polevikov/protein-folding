export const STAGE_WIDTH = window.innerWidth * 0.75;
export const STAGE_HEIGHT = window.innerHeight * 0.85;

export const NUMBER_OF_PARTICLES = 14;
export const PARTICLE_RADIUS = 45;
export const IS_SPLITTED = false;

export const INTERACTION_POWERS = {
  'red': { 'red': -1, 'green': +1, 'blue': +1 },
  'green': { 'red': +1, 'green': -1, 'blue': +1 },
  'blue': { 'red': +1, 'green': +1, 'blue': -1 }
};
