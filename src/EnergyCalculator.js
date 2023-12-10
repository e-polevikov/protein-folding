
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
