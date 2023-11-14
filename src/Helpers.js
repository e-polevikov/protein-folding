import {
  particleColors,
  particlesMoveAttemptsLimit,
  stageWidth, stageHeight
} from './Constants';

function getRandomInteger(maxValueExcl) {
  return Math.floor(Math.random() * (maxValueExcl));
}

function generateParticleColor(colorToExclude) {
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

function isValidParticlePosition(
  particles, randX, randY,
  particleId, particleRadius
) {
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

  if (randX - particleRadius < 0.0 || randX + particleRadius >= stageWidth) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius >= stageHeight) {
    particleIntersectsStageBoudaries = true;
  }

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}

export function generateParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  while (numOfGeneratedParticles < numOfParticles) {
    let randX = Math.random() * (stageWidth - particleRadius);
    let randY = Math.random() * (stageHeight - particleRadius);
    let generatedParticleId = numOfGeneratedParticles + 1;

    if (isValidParticlePosition(
      particles, randX, randY,
      generatedParticleId, particleRadius
    )) {
      particles.push({ 
        id: numOfGeneratedParticles.toString(), 
        x: randX, y: randY, color: generateParticleColor()
      });
      
      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}

function calculateParticleEnergy(particle1, particle2, interactionPowers) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);
  let totalDist = Math.sqrt(xDistance + yDistance);

  let energy = 1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6);
  energy *= 4.0 * Math.pow(10, 10);
  energy *= interactionPowers[particle1.color][particle2.color];

  return energy;
}

function calculateTotalEnergy(particles, interactionPowers) {
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

export function moveParticlesRandomly(particles, particleRadius, moveP, interactionPowers) {
  let movedParticles = JSON.parse(JSON.stringify(particles));

  movedParticles.map((particle) => {
    let particleIsMoved = false;
    let moveAttempts = 0;
    let currentX = particle.x;
    let currentY = particle.y;

    while (!particleIsMoved && moveAttempts < particlesMoveAttemptsLimit) {
      let randX = particle.x + (Math.random() - 0.5) * 10;
      let randY = particle.y + (Math.random() - 0.5) * 10;
      let currentParticleId = Number(particle.id);

      if (isValidParticlePosition(
        movedParticles, randX, randY,
        currentParticleId,
        particleRadius
      )) {
        particle.x = randX;
        particle.y = randY;
        particleIsMoved = true;
      }

      moveAttempts += 1;
    }
    
    // If total energy increases after a particle is moved, the particle
    // remains on its position with the probability equal to 'moveP'.
    // Therefore, '1 - moveP' is the probability that the particle
    // will be 'moved back' to its initial position.

    if (calculateTotalEnergy(movedParticles, interactionPowers) > 
        calculateTotalEnergy(particles, interactionPowers) &&
        Math.random() < 1 - moveP
    ) {
      particle.x = currentX;
      particle.y = currentY;
    }
    
    return particle;
  });

  return movedParticles;
};
