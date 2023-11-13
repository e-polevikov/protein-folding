import {
  stageWidth,
  stageHeight,
  particleColors
} from './Constants.js';

function calculateParticleEnergy(particle1, particle2, interactionPowers) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);
  let totalDist = Math.sqrt(xDistance + yDistance);

  let energy = 1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6);
  energy *= 4.0 * Math.pow(10, 10);
  energy *= interactionPowers[particle1.color][particle2.color];

  return energy;
}

function getRandomInteger(maxValueExcl) {
  return Math.floor(Math.random() * (maxValueExcl));
}

export function getRandomColor(colorToExclude) {
  let numColors = particleColors.length;

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
  
export function calculateTotalEnergy(particles, interactionPowers) {
  let totalEnergy = 0.0;

  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      totalEnergy += calculateParticleEnergy(
        particles[i], particles[j],
        interactionPowers
      );
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

function generateIndependentParticles(numOfParticles, particleRadius) {
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

function generateChainOfParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({ 
    id: numOfGeneratedParticles.toString(), 
    x: stageWidth * 0.15, y: stageHeight * 0.5,
    color: getRandomColor()
  });

  numOfGeneratedParticles += 1;

  while (numOfGeneratedParticles < numOfParticles) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let alpha = 30 * (Math.random() * 2 - 1);
    let nextX = currentX + 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = currentY + Math.tan(alpha) * (nextX - currentX);

    let generatedCircleId = numOfGeneratedParticles + 1;
    
    if (isValidParticlePosition(particles, nextX, nextY, generatedCircleId, particleRadius)) {
      particles.push({ 
        id: numOfGeneratedParticles.toString(), 
        x: nextX, y: nextY, color: getRandomColor()
      });

      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}

export function moveParticlesChainRandomly(particles, interactionPowers, particleRadius) {
  let particlesCopy = JSON.parse(JSON.stringify(particles));

  let randomParticleIdx = getRandomInteger(particlesCopy.length);
  let randomAngle = 10 * (2 * Math.random() - 1);
  let numProcessedParticles = 0;

  for (let i = randomParticleIdx + 1; i < particleColors.length; i++) {
    let newAngle = Math.atan((particles[i].y - particles[i - 1].y) / (particles[i].x - particles[i - 1].x));
    newAngle += randomAngle;

    let newX = particles[i - 1].x + 2 * (numProcessedParticles + 1) * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(newAngle), 2));
    let newY = particles[i - 1].y + Math.tan(newAngle) * (particles[i].x - particles[i - 1].x);

    particles[i].x = newX;
    particles[i].y = newY;

    numProcessedParticles += 1;
  }

  return particles;
}
  
export function generateParticles(numOfParticles, particleRadius) {
  let generateChain = true;

  if (generateChain) {
    return generateChainOfParticles(numOfParticles, particleRadius);
  }

  return generateIndependentParticles(numOfParticles, particleRadius);
}
