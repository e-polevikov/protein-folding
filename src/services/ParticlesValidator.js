import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/FoldingStage';

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
