import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  ROTATION_ANGLE,
  MOVE_DISTANCE
} from '../Constants';

function intersects(particle1, particle2, particleRadius) {
  let xDistance = Math.pow((particle1.x - particle2.x), 2);
  let yDistance = Math.pow((particle1.y - particle2.y), 2);

  return xDistance + yDistance < 4.0 * Math.pow(particleRadius, 2);
}

export function haveIntersections(particles, particleRadius, isSplitted) {
  for (let i = 0; i < particles.length - 1; i++) {
    for (let j = i + 2; j < particles.length; j++) {
      if (intersects(particles[i], particles[j], particleRadius)) {
        return true;
      }
    }
  }

  if (isSplitted) {
    let splitIdx = Math.floor(particles.length / 2);

    if (intersects(
      particles[splitIdx - 1],
      particles[splitIdx],
      particleRadius)
    ) {
      return true;
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

export function rotateParticles(
  particles,
  pivotParticleId,
  rotationDirection,
  isSplitted,
) {
  let rotatedParticles = JSON.parse(JSON.stringify(particles));
  let IdsToRotate = [];

  if (rotationDirection < 2) {
    let upperBound = rotatedParticles.length;

    if (isSplitted) {
      let splitIdx = Math.floor(rotatedParticles.length / 2);
      if (pivotParticleId < splitIdx) {
        upperBound = splitIdx;
      }
    }

    for (let i = pivotParticleId + 1; i < upperBound; i++) {
      IdsToRotate.push(i);
    }
  } else {
    let lowerBound = 0;

    if (isSplitted) {
      let splitIdx = Math.floor(rotatedParticles.length / 2);
      if (pivotParticleId >= splitIdx) {
        lowerBound = splitIdx;
      }
    }

    for (let i = lowerBound; i < pivotParticleId; i++) {
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

export function moveParticles(particles, direction, pivotParticleId, isSplitted) {
  let movedParticles = JSON.parse(JSON.stringify(particles));

  for (let i = 0; i < movedParticles.length; i++) {
    if (isSplitted) {
      let splitIdx = Math.floor(movedParticles.length / 2);

      if (pivotParticleId < splitIdx && i >= splitIdx) {
        continue;
      }

      if (pivotParticleId >= splitIdx && i < splitIdx) {
        continue;
      }
    }

    if (direction == 0) {
      movedParticles[i].x -= MOVE_DISTANCE;
    } else if (direction == 1) {
      movedParticles[i].x += MOVE_DISTANCE;
    } else if (direction == 2) {
      movedParticles[i].y -= MOVE_DISTANCE;
    } else if (direction == 3) {
      movedParticles[i].y += MOVE_DISTANCE;
    }
  }

  return movedParticles;
}
