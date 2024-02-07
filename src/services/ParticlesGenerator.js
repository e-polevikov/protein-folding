import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/FoldingStage';
import { PARTICLE_COLORS } from '../constants/ParticlesChain';

import {
  haveIntersections,
  chainIsOutOfStageBoundaries
} from './ParticlesValidator';

import { rotatePoint } from './ParticlesRotator';

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

function generateSplittedParticles(
  numOfParticles, particleRadius
) {
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

  if (haveIntersections(particles1, particleRadius, true) ||
    chainIsOutOfStageBoundaries(particles1, particleRadius)
  ) {
    return generateParticles(numOfParticles, particleRadius, true);
  }

  return particles1;
}

function generateZigzagChain(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({
    id: numOfGeneratedParticles.toString(),
    x: STAGE_WIDTH * 0.05,
    y: STAGE_HEIGHT * 0.9,
    color: generateParticleColor()
  });

  numOfGeneratedParticles += 1;  

  let alpha = -1.0;
  while (numOfGeneratedParticles < numOfParticles) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let nextX = currentX + 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = currentY + Math.tan(alpha) * (nextX - currentX);

    if (nextX + particleRadius >= STAGE_WIDTH) {
      break;
    }

    if (alpha < 0) {
      if (nextY - particleRadius > 20.0) {
        particles.push({
          id: numOfGeneratedParticles.toString(),
          x: nextX, y: nextY,
          color: generateParticleColor()
        });
          
        numOfGeneratedParticles += 1;
      } else {
        alpha *= -1;
      }
    } else {
      if (nextY + particleRadius < STAGE_HEIGHT - 20.0) {
        particles.push({
          id: numOfGeneratedParticles.toString(),
          x: nextX, y: nextY,
          color: generateParticleColor()
        });
          
        numOfGeneratedParticles += 1;
      } else {
        alpha *= -1;
      }
    }
  }

  return particles;
}

export function generateParticles(
  numOfParticles, particleRadius,
  isSplitted, initY = 0.5, zigzag = false
) {
  if (isSplitted) {
    return generateSplittedParticles(numOfParticles, particleRadius);
  }

  if (!isSplitted && zigzag) {
    return generateZigzagChain(numOfParticles, particleRadius);
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

export function initializeParticles(
  particlesColors,
  particleRadius,
  angles,
  isSplitted
) {
  let particles = [];

  particles.push({
    id: "0",
    x: STAGE_WIDTH * 0.075,
    y: STAGE_HEIGHT * 0.5,
    color: particlesColors[0]
  });

  for (let i = 1; i < particlesColors.length; i++) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let nextX = currentX + 2 * particleRadius;
    let nextY = currentY;

    [nextX, nextY] = rotatePoint(nextX, nextY, currentX, currentY, angles[i - 1]);

    particles.push({
      id: i.toString(),
      x: nextX,
      y: nextY,
      color: particlesColors[i]
    });
  }
 
  return particles;
}
