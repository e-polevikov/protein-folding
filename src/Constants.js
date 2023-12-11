export const STAGE_WIDTH = window.innerWidth * 0.75;
export const STAGE_HEIGHT = window.innerHeight * 0.80;

export const INITIAL_NUMBER_OF_PARTICLES = 18;
export const INITIAL_PARTICLE_RADIUS = 35;

export const PIVOT_PARTICLE_STROKE_WIDTH = 4;
export const JOIN_LINE_STROKE_WIDTH = 5;

export const PARTICLE_COLORS = ['red', 'green', 'blue'];

export const INTERACTION_POWERS = {
  'red':   {'red': -1, 'green': +1, 'blue': +1},
  'green': {'red': +1, 'green': -1, 'blue': +1},
  'blue':  {'red': +1, 'green': +1, 'blue': -1}
};

export const ROTATION_DIRECTIONS = [
  {'direction': 2, 'unicodeSymbol': '\u21BB'}, // clockwise, left from pivot
  {'direction': 3, 'unicodeSymbol': '\u21BA'}, // counter clockwise, left from pivot
  {'direction': 0, 'unicodeSymbol': '\u21BB'}, // clockwise, right from pivot
  {'direction': 1, 'unicodeSymbol': '\u21BA'}  // counter clockwise, right from pivot 
];

export const MOVEMENT_DIRECTIONS = [
  {'direction': 0, 'unicodeSymbol': '\u2190'}, // left
  {'direction': 1, 'unicodeSymbol': '\u2192'}, // right
  {'direction': 2, 'unicodeSymbol': '\u2191'}, // up
  {'direction': 3, 'unicodeSymbol': '\u2193'}  // down
];

export const ROTATION_ANGLE = 0.01;
export const MOVE_DISTANCE = 3.0;
export const PARTICLES_RERENDERING_TIMEOUT = 10;
