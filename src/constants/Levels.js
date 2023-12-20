export const LEVEL1_SETTINGS = {
  'NUMBER_OF_PARTICLES': 14,
  'PARTICLE_RADIUS': 45,
  'IS_SPLITTED': false,
  'POWERS': {
    'red': { 'red': -1, 'green': +1, 'blue': +1 },
    'green': { 'red': +1, 'green': -1, 'blue': +1 },
    'blue': { 'red': +1, 'green': +1, 'blue': -1 }
  }
};

export const LEVEL2_SETTINGS = {
  'NUMBER_OF_PARTICLES': 20,
  'PARTICLE_RADIUS': 35,
  'IS_SPLITTED': false,
  'POWERS': {
    'red': { 'red': -1, 'green': -2, 'blue': +3 },
    'green': { 'red': -2, 'green': +2, 'blue': +1 },
    'blue': { 'red': +3, 'green': +1, 'blue': -3 }
  }
};

export const LEVEL3_SETTINGS = {
  'NUMBER_OF_PARTICLES': 26,
  'PARTICLE_RADIUS': 45,
  'IS_SPLITTED': true,
  'POWERS': {
    'red': { 'red': -1, 'green': +1, 'blue': +4 },
    'green': { 'red': +1, 'green': -2, 'blue': +1 },
    'blue': { 'red': +4, 'green': +1, 'blue': -3 }
  }
};
