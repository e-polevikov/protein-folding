import {
  particleColors,
  particlesMoveAttemptsLimit,
  stageWidth, stageHeight
} from './Constants';

function randomSign() {
  if (Math.random() < 0.5) {
    return 1;
  }

  return -1;
}

function getRandomInteger(maxValueExcl) {
  return Math.floor(Math.random() * (maxValueExcl));
}

export function generateParticleColor(colorToExclude) {
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

export function getParticleColor(particle) {
  if (particle.isIntersecting) {
    return 'grey';
  }

  return particle.color;
}

export function isValidParticlePosition(
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

export function findIntersectingParticles(particles, particleRadius) {
  let intersectingParticlesIds = [];

  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (haveIntersection(particles[i], particles[j], particleRadius)) {
        intersectingParticlesIds.push(i);
        intersectingParticlesIds.push(j);
      }
    }
  }

  return intersectingParticlesIds;
}

function haveIntersection(particle1, particle2, particleRadius) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);

  return xDistance + yDistance < 4.0 * Math.pow(particleRadius, 2);
}

function generateParticlesChain(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({ 
    id: numOfGeneratedParticles.toString(), 
    x: stageWidth * 0.5 + randomSign() * Math.random() * 10,
    y: stageHeight * 0.5 + randomSign() * Math.random() * 10,
    color: generateParticleColor()
  });

  numOfGeneratedParticles += 1;

  while (numOfGeneratedParticles < numOfParticles) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let alpha = 2 * Math.random() - 1;
    let nextX = currentX + randomSign() * 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = currentY + Math.tan(alpha) * (nextX - currentX);

    let generatedParticleId = numOfGeneratedParticles + 1;
    
    if (isValidParticlePosition(particles, nextX, nextY, generatedParticleId, particleRadius)) {
      particles.push({ 
        id: numOfGeneratedParticles.toString(), 
        x: nextX, y: nextY, color: generateParticleColor()
      });

      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}

export function generateParticles(numOfParticles, particleRadius, particlesAsChain) {
  if (particlesAsChain != null && particlesAsChain) {
    return generateParticlesChain(numOfParticles, particleRadius);
  }

  // Otherwise, generate particles randomly:

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
        x: randX, y: randY, color: generateParticleColor(),
        isIntersecting: false
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
  energy *= 4.0 * interactionPowers[particle1.color][particle2.color];
  energy *= Math.pow(10, 10);

  return energy;
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

function moveParticlesChain(
  particles,
  particleRadius,
  moveP,
  interactionPowers
) {
  let movedParticles = [];
  let numOfMovedParticles = 0;

  movedParticles.push({ 
    id: numOfMovedParticles.toString(), 
    x: particles[0].x + randomSign() * Math.random() * 10,
    y: particles[0].y + randomSign() * Math.random() * 10,
    color: particles[numOfMovedParticles].color
  });

  numOfMovedParticles += 1;

  while (numOfMovedParticles < particles.length) {
    let currentX = movedParticles[movedParticles.length - 1].x;
    let currentY = movedParticles[movedParticles.length - 1].y;

    let alpha = 2 * Math.random() - 1;
    let nextX = currentX + randomSign() * 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = currentY + Math.tan(alpha) * (nextX - currentX);

    let generatedParticleId = numOfMovedParticles + 1;
    
    if (isValidParticlePosition(movedParticles, nextX, nextY, generatedParticleId, particleRadius)) {
      movedParticles.push({ 
        id: numOfMovedParticles.toString(), 
        x: nextX, y: nextY, color: particles[numOfMovedParticles].color
      });

      numOfMovedParticles += 1;
    }
  }

  if (calculateTotalEnergy(movedParticles, interactionPowers) < 
      calculateTotalEnergy(particles, interactionPowers) ||
      Math.random() < moveP
  ) {
    return movedParticles
  }

  return particles;
}

export function moveParticlesRandomly(
  particles,
  particleRadius,
  moveP,
  interactionPowers,
  particlesAsChain
) {
  if (particlesAsChain != null && particlesAsChain) {
    return moveParticlesChain(particles, particleRadius, moveP, interactionPowers);
  }

  // Otherwise, move particles randomly:

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
