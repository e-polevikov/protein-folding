import {
  PARTICLE_COLORS,
  MOVE_ATTEMPTS_LIMIT,
  STAGE_WIDTH, STAGE_HEIGHT
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
  let numColors = PARTICLE_COLORS.length;

  if (colorToExclude == null) {
    return PARTICLE_COLORS[getRandomInteger(numColors)];
  }

  while (true) {
    let color = PARTICLE_COLORS[getRandomInteger(numColors)];

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

  if (randX - particleRadius < 0.0 || randX + particleRadius >= STAGE_WIDTH) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius >= STAGE_HEIGHT) {
    particleIntersectsStageBoudaries = true;
  }

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}

export function findIntersectingParticles(particles, particleRadius, isChain) {
  let intersectingParticlesIds = [];

  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (isChain && j - 1 == i) {
        continue;
      }

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

export function generateParticlesChain(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({ 
    id: numOfGeneratedParticles.toString(), 
    x: STAGE_WIDTH * 0.25 + randomSign() * Math.random() * 10,
    y: STAGE_HEIGHT * 0.5 + randomSign() * Math.random() * 10,
    color: generateParticleColor()
  });

  numOfGeneratedParticles += 1;

  while (numOfGeneratedParticles < numOfParticles) {
    let currentX = particles[particles.length - 1].x;
    let currentY = particles[particles.length - 1].y;

    let alpha = Math.random() - 0.5;
    let nextX = currentX + 2 * particleRadius / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
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

export function generateParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  while (numOfGeneratedParticles < numOfParticles) {
    let randX = Math.random() * (STAGE_WIDTH - particleRadius);
    let randY = Math.random() * (STAGE_HEIGHT - particleRadius);
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
      let energy = calculateParticleEnergy(
        particles[i], particles[j],
        interactionPowers
      );

      totalEnergy += energy;
    }
  }

  return totalEnergy;
}

export function moveParticlesChain(particles, pivotParticleId, rotationDirection) {
  let movedParticles = JSON.parse(JSON.stringify(particles));

  let IdsToRotate = [];
  if (rotationDirection < 2) {
    for (let i = pivotParticleId + 1; i < movedParticles.length; i++) {
      IdsToRotate.push(i);
    }
  } else {
    for (let i = 0; i < pivotParticleId; i++) {
      IdsToRotate.push(i);
    }
  }

  let pivotX = particles[pivotParticleId].x;
  let pivotY = particles[pivotParticleId].y;

  IdsToRotate.forEach((i) => {
    let currentX = movedParticles[i].x;
    let currentY = movedParticles[i].y;

    let currentAngle = Math.atan(
      Math.abs((pivotY - currentY) / (pivotX - currentX))
    );

    let alpha = 0;

    if (currentX > pivotX && currentY < pivotY) {
      alpha = -currentAngle;
    } else if (currentX < pivotX && currentY < pivotY) {
      alpha = -Math.PI + currentAngle;
    } else if (currentX < pivotX && currentY > pivotY) {
      alpha = Math.PI - currentAngle;
    } else {
      alpha = currentAngle;
    }

    if (rotationDirection == 0 || rotationDirection == 2) {
      alpha += 0.025;
    }

    if (rotationDirection == 1 || rotationDirection == 3) {
      alpha -= 0.025;
    }

    let distance = Math.sqrt(
      Math.pow(pivotX - currentX, 2) + Math.pow(pivotY - currentY, 2)
    );

    if (alpha > Math.PI / 2 || alpha < -Math.PI / 2) {
      distance *= -1;
    }

    let nextX = pivotX + distance / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = pivotY + Math.tan(alpha) * (nextX - pivotX);

    movedParticles[i].x = nextX;
    movedParticles[i].y = nextY;
  });

  return movedParticles;
}

export function moveParticlesRandomly(
  particles,
  particleRadius,
  moveP,
  interactionPowers
) {
  let movedParticles = JSON.parse(JSON.stringify(particles));

  movedParticles.map((particle) => {
    let particleIsMoved = false;
    let moveAttempts = 0;
    let currentX = particle.x;
    let currentY = particle.y;

    while (!particleIsMoved && moveAttempts < MOVE_ATTEMPTS_LIMIT) {
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
