import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  ROTATION_ANGLE,
  MOVE_DISTANCE
} from '../Constants';

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

export function chainIsOutOfStageBoundaries(particles, particleRadius) {
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].x - particleRadius < 0.0 ||
        particles[i].x + particleRadius >= STAGE_WIDTH
    ) {
      return true;
    }
  
    if (particles[i].y - particleRadius < 0.0 ||
        particles[i].y + particleRadius >= STAGE_HEIGHT
    ) {
      return true;
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

export function moveParticles(particles, direction) {
  let movedParticles = JSON.parse(JSON.stringify(particles));

  movedParticles = movedParticles.map((particle) => {
    if (direction == 0) {
      particle.x -= MOVE_DISTANCE;
    } else if (direction == 1) {
      particle.x += MOVE_DISTANCE;
    } else if (direction == 2) {
      particle.y -= MOVE_DISTANCE;
    } else if (direction == 3) {
      particle.y += MOVE_DISTANCE;
    }

    return particle;
  });

  return movedParticles;
}
