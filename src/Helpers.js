import {
  stageWidth,
  stageHeight,
  particleColors,
  interactionPower,
} from './Constants.js';

function calculateParticleEnergy(particle1, particle2) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);
  let totalDist = Math.sqrt(xDistance + yDistance);

  let energy = 1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6);
  energy = Math.pow(10, 10) * 4.0 * energy;

  energy = energy * interactionPower[particle1.color][particle2.color];

  return energy;
}

function getRandomInteger(maxValueExcl) {
  return Math.floor(Math.random() * (maxValueExcl));
}

export function getRandomColor(colorToExclude) {
  let numColors = 3;

  if (colorToExclude == null) {
    return particleColors[getRandomInteger(numColors)];
  }

  while (true) {
    let color = particleColors[getRandomInteger(numColors)];

    if (color !== colorToExclude) {
      return color;
    }
  } 
}
  
export function calculateTotalEnergy(particles) {
  let totalEnergy = 0.0;

  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      totalEnergy += calculateParticleEnergy(particles[i], particles[j]);
    }
  }

  return totalEnergy;
}
  
export function isValidParticlePosition(particles, randX, randY, particleId, particleRadius) {
  let particleIntersectsExisting = false;

  for (let i = 0; i < particles.length; i++) {
    if (i === particleId) {
      continue;
    }

    let xDistance = Math.pow((particles[i].x - randX), 2);
    let yDistance = Math.pow((particles[i].y - randY), 2);

    if (xDistance + yDistance <= 4.0 * Math.pow(particleRadius, 2)) {
      particleIntersectsExisting = true;
      break;
    }
  }

  let particleIntersectsStageBoudaries = false;

  if (randX - particleRadius < 0.0 || randX + particleRadius > stageWidth) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius > stageHeight) {
    particleIntersectsStageBoudaries = true;
  }

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}
  
export function generateParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  while (numOfGeneratedParticles < numOfParticles) {
    let randX = Math.random() * stageWidth;
    let randY = Math.random() * stageHeight;
    let generatedCircleId = numOfGeneratedParticles + 1;

    if (isValidParticlePosition(particles, randX, randY, generatedCircleId, particleRadius)) {
      particles.push({ 
        id: numOfGeneratedParticles.toString(), 
        x: randX, y: randY, color: getRandomColor()
      });
      
      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}
