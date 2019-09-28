import CONSTANTS from '@/js/constants'

export default class Species {
  constructor (name, colour, mass, radius = Math.sqrt(mass * CONSTANTS.PARTICLE_MASS_AREA_CONVERSION)) {
    this.name = name
    this.colour = colour
    this.mass = mass
    this.radius = radius
  }
}
