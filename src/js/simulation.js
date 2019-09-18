import CONSTANTS from '@/js/constants'
import Particle from './particle'
import Species from './species'
import Vector from './vector'

function getRmsGasSpeed (temperature, mass) {
  return Math.sqrt(3 * CONSTANTS.GAS_CONSTANT * temperature / mass)
}

export default class Simulation {
  constructor (dimensions = new Vector(2000, 2000), mechanism = [], initialTemperature = 1, collisionGridSize = CONSTANTS.COLLISION_GRID_SIZE) {
    this.dimensions = dimensions
    this.mechanism = mechanism
    this.temperature = initialTemperature
    this.collisionsGridSize = collisionGridSize
    this.particles = []
    this.age = 0

    let s = new Species('prem', '#FF0000', 1, 3)

    for (let i = 0; i < 1000; i++) {
      this.addParticle(s)
    }
  }

  addParticle (
    species,
    pos = new Vector(Math.random() * this.dimensions.x, Math.random() * this.dimensions.y),
    // If no position is supplied, select randomly within the bounds of the simulation
    vel = new Vector().fromAngle(Math.random() * 2 * Math.PI, getRmsGasSpeed(this.temperature, species.mass))
    // If no velocity is supplied, set to the RMS speed for the simulation's temperature, pointing in a random direction
  ) {
    let particleToAdd = new Particle(species, pos, vel)
    this.particles.push(particleToAdd)
  }

  resolveWallCollisions () {
    for (let particle of this.particles) {
      if (particle.pos.x < particle.radius) {
        particle.vel.x *= -1
        particle.pos.x = particle.radius
      } else if (particle.pos.x > this.dimensions.x - particle.radius) {
        particle.vel.x *= -1
        particle.pos.x = this.dimensions.x - particle.radius
      }
      if (particle.pos.y < particle.radius) {
        particle.vel.y *= -1
        particle.pos.y = particle.radius
      } else if (particle.pos.y > this.dimensions.y - particle.radius) {
        particle.vel.y *= -1
        particle.pos.y = this.dimensions.y - particle.radius
      }
    }
  }

  resolveParticleCollisions () {
    let grids = []
    const numGridsX = Math.ceil(this.dimensions.x / this.collisionsGridSize)
    const numGridsY = Math.ceil(this.dimensions.y / this.collisionsGridSize)
    for (let x = 0; x < numGridsX; x++) {
      grids[x] = []
      for (let y = 0; y < numGridsY; y++) {
        grids[x].push([])
      }
    }
    for (let particle of this.particles) {
      grids[particle.currentGrid.x][particle.currentGrid.y].push(particle)
    }

    for (let row of grids) {
      for (let square of row) {
        for (let i = 0; i < square.length; i++) {
          let p1 = square[i]
          for (let j = 0; j < i; j++) {
            let p2 = square[j]
            if (p1.isColliding(p2)) {
              p1.bounceOff(p2)
            }
          }
        }
      }
    }
  }

  updateParticleGrid () {
    for (let particle of this.particles) {
      particle.currentGrid.x = Math.floor(particle.pos.x / this.collisionsGridSize)
      particle.currentGrid.y = Math.floor(particle.pos.y / this.collisionsGridSize)
    }
  }

  tick () {
    this.age++
    for (let particle of this.particles) {
      particle.pos.add(particle.vel)
    }
    this.resolveWallCollisions()
    this.updateParticleGrid()
    this.resolveParticleCollisions()
  }
}
