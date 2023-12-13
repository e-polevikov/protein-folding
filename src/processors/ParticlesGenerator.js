import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  PARTICLE_COLORS
} from '../Constants';

import {
  haveIntersections,
  chainIsOutOfStageBoundaries
} from './ParticlesController';

function randomSign() {
  return Math.random() < 0.5 ? 1 : -1;
}

function randomNumber(maxValueExcl) {
  return Math.floor(Math.random() * (maxValueExcl));
}

function generateParticleColor(colorToExclude) {
  let numColors = PARTICLE_COLORS.length;

  if (colorToExclude == null) {
    return PARTICLE_COLORS[randomNumber(numColors)];
  }

  while (true) {
    let color = PARTICLE_COLORS[randomNumber(numColors)];

    if (color !== colorToExclude) {
      return color;
    }
  }
}

function isValidParticlePosition(
  particles,
  randX, randY,
  particleRadius
) {
  let particleIntersectsExisting = false;

  for (let i = 0; i < particles.length; i++) {
    let xDistance = Math.pow((particles[i].x - randX), 2);
    let yDistance = Math.pow((particles[i].y - randY), 2);

    if (xDistance + yDistance <= 4.0 * Math.pow(particleRadius, 2)) {
      particleIntersectsExisting = true;
      break;
    }
  }

  let particleIntersectsStageBoudaries = false;

  if (randX - particleRadius < 0.0 || randX + particleRadius >= STAGE_WIDTH) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius >= STAGE_HEIGHT) {
    particleIntersectsStageBoudaries = true;
  }

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}

export function generateParticles(numOfParticles, particleRadius, isSplitted, initY = 0.5) {
  if (isSplitted) {
    let particles1 = generateParticles(
      Math.floor(numOfParticles / 2),
      particleRadius, false, 0.25
    );

    let particles2 = generateParticles(
      Math.ceil(numOfParticles / 2),
      particleRadius, false, 0.75
    );

    for (let i = 0; i < particles2.length; i++) {
      let currentId = Number(particles2[i].id);
      currentId += particles2.length;
      particles2[i].id = currentId.toString();
    }

    particles1 = particles1.concat(particles2);

    if (haveIntersections(particles1, particleRadius, isSplitted) ||
      chainIsOutOfStageBoundaries(particles1, particleRadius)
    ) {
      particles1 = generateParticles(
        numOfParticles, particleRadius,
        isSplitted, initY
      );
    }

    return particles1;
  }

  let maxNumOfParticles = Math.floor(STAGE_WIDTH * 0.925 / (2.0 * particleRadius));

  if (numOfParticles > maxNumOfParticles) {
    numOfParticles = maxNumOfParticles;
  }

  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({
    id: numOfGeneratedParticles.toString(),
    x: STAGE_WIDTH * 0.075 + randomSign() * Math.random() * 10,
    y: STAGE_HEIGHT * initY + randomSign() * Math.random() * 10,
    color: generateParticleColor()
  });

  numOfGeneratedParticles += 1;

  while (numOfGeneratedParticles < numOfParticles) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let alpha = Math.random() - 0.5;
    let nextX = currentX + 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = currentY + Math.tan(alpha) * (nextX - currentX);

    particles.push({
      id: numOfGeneratedParticles.toString(),
      x: nextX, y: nextY,
      color: generateParticleColor()
    });

    numOfGeneratedParticles += 1;
  }

  return particles;
}
