import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  PARTICLE_COLORS,
  ROTATION_ANGLE
} from './Constants';

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

  /*
  if (randX - particleRadius < 0.0 || randX + particleRadius >= STAGE_WIDTH) {
    particleIntersectsStageBoudaries = true;
  }

  if (randY - particleRadius < 0.0 || randY + particleRadius >= STAGE_HEIGHT) {
    particleIntersectsStageBoudaries = true;
  }
  */

  return !particleIntersectsExisting && !particleIntersectsStageBoudaries;
}

export function generateParticles(numOfParticles, particleRadius) {
  let particles = [];
  let numOfGeneratedParticles = 0;

  particles.push({ 
    id: numOfGeneratedParticles.toString(), 
    x: STAGE_WIDTH * 0.1 + randomSign() * Math.random() * 10,
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
        x: nextX, y: nextY,
        color: generateParticleColor()
      });

      numOfGeneratedParticles += 1;
    }
  }

  return particles;
}

export function haveIntersections(particles, particleRadius) {
  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 2; j < particles.length; j++) {
      let xDistance = Math.pow((particles[i].x - particles[j].x), 2);
      let yDistance = Math.pow((particles[i].y - particles[j].y), 2);
    
      if (xDistance + yDistance < 4.0 * Math.pow(particleRadius, 2)) {
        return true;
      }
    }
  }

  return false;
}

export function rotateParticles(particles, pivotParticleId, rotationDirection) {
  let rotatedParticles = JSON.parse(JSON.stringify(particles));
  let IdsToRotate = [];

  if (rotationDirection < 2) {
    for (let i = pivotParticleId + 1; i < rotatedParticles.length; i++) {
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
    let currentX = rotatedParticles[i].x;
    let currentY = rotatedParticles[i].y;

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
      alpha += ROTATION_ANGLE;
    }

    if (rotationDirection == 1 || rotationDirection == 3) {
      alpha -= ROTATION_ANGLE;
    }

    let distance = Math.sqrt(
      Math.pow(pivotX - currentX, 2) + Math.pow(pivotY - currentY, 2)
    );

    if (alpha > Math.PI / 2 || alpha < -Math.PI / 2) {
      distance *= -1;
    }

    let nextX = pivotX + distance / Math.sqrt(1 + Math.pow(Math.tan(alpha), 2));
    let nextY = pivotY + Math.tan(alpha) * (nextX - pivotX);

    rotatedParticles[i].x = nextX;
    rotatedParticles[i].y = nextY;
  });

  return rotatedParticles;
}

function calculateEnergy(particle1, particle2, interactionPowers) {
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
      let energy = calculateEnergy(
        particles[i], particles[j],
        interactionPowers
      );

      totalEnergy += energy;
    }
  }

  return totalEnergy;
}
