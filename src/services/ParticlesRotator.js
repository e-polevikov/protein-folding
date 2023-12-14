import { ROTATION_ANGLE, ROTATION_DIRECTIONS } from '../constants/RotationControl';

export function rotateParticles(
  particles,
  pivotParticleId,
  rotationDirection,
  isSplitted,
) {
  let rotatedParticles = JSON.parse(JSON.stringify(particles));
  let IdsToRotate = [];

  if (rotationDirection == ROTATION_DIRECTIONS[2].key ||
    rotationDirection == ROTATION_DIRECTIONS[3].key
  ) {
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

    if (rotationDirection == ROTATION_DIRECTIONS[0].key ||
      rotationDirection == ROTATION_DIRECTIONS[2].key
    ) {
      alpha += ROTATION_ANGLE;
    }

    if (rotationDirection == ROTATION_DIRECTIONS[1].key ||
      rotationDirection == ROTATION_DIRECTIONS[3].key
    ) {
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
