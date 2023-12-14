import { MOVE_DISTANCE, MOVEMENT_DIRECTIONS } from "../constants/MovementControl";

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

    switch (direction) {
      case MOVEMENT_DIRECTIONS[0].key:
        movedParticles[i].x -= MOVE_DISTANCE;
        break;
      case MOVEMENT_DIRECTIONS[1].key:
        movedParticles[i].x += MOVE_DISTANCE;
        break;
      case MOVEMENT_DIRECTIONS[2].key:
        movedParticles[i].y -= MOVE_DISTANCE;
        break;
      case MOVEMENT_DIRECTIONS[3].key:
        movedParticles[i].y += MOVE_DISTANCE;
        break;
    }
  }

  return movedParticles;
}
