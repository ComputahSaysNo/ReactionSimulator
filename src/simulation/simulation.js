import CONSTANTS from '@/simulation/constants'
import Particle from './particle'
import Species from './species'
import Vector from './vector'
import Mechanism from '@/simulation/mechanism'

function getMBVelVector (temperature, mass) {
  let components = []
  // to follow MB, x and y need to be gaussian variables with mean 0 and sd (sqrt(T*k/m))
  for (let x = 0; x < 2; x++) {
    let u = 0; let v = 0
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let gauss = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    // Box-Muller transform to generate numbers from N(0, 1) using two uniform random variables
    components.push(Math.sqrt(CONSTANTS.GAS_CONSTANT * temperature / mass) * gauss)
    // Scale by desired sd
  }
  return new Vector(components[0], components[1])
}

export default class Simulation {
  constructor (dimensions = new Vector(2000, 2000), mechanism = [], initialTemperature = 100, collisionGridSize = CONSTANTS.COLLISION_GRID_SIZE) {
    this.dimensions = dimensions

    this.mechanism = new Mechanism()

    let a = new Species('a', '#FF0000', 50)
    let b = new Species('b', '#28793c', 50)
    let c = new Species('c', '#3997ff', 50)
    let d = new Species('d', '#aea328', 50)
    // let e = new Species('e', '#000000', 20, 1)
    this.speciesInvolved = {
      a: a,
      b: b,
      c: c,
      d: d
    }

    this.mechanism.addStep([a, b], [c, d], 20, -10, false)

    this.temperature = initialTemperature
    this.collisionsGridSize = collisionGridSize
    this.particles = []
    this.queuedParticlesToAdd = []
    this.age = 0
    this.idCounter = makeCounter()

    for (let i = 0; i < 800; i++) {
      this.addParticle(a)
    }
    for (let i = 0; i < 800; i++) {
      this.addParticle(b)
    }
    // for (let i = 0; i < 500; i++) {
    //   this.addParticle(c)
    // }
    // for (let i = 0; i < 500; i++) {
    //   this.addParticle(d)
    // }
    // for (let i = 0; i < 4000; i++) {
    //   this.addParticle(e)
    // }
    // this.addParticle(a, new Vector(100, 100), new Vector(0, 1))
    // this.addParticle(b, new Vector(100, 500), new Vector(0, -1))

    console.log(this)
  }

  addParticle (
    species,
    pos = new Vector(Math.random() * this.dimensions.x, Math.random() * this.dimensions.y),
    // If no position is supplied, select randomly within the bounds of the simulation
    vel = getMBVelVector(this.temperature, species.mass)
    // If no velocity is supplied, set to the RMS speed for the simulation's temperature, pointing in a random direction
  ) {
    let particleToAdd = new Particle(species, pos, vel)
    this.queuedParticlesToAdd.push(particleToAdd)
  }

  getParticleById (id) {
    for (let particle of this.particles) {
      if (particle.id === id) return particle
    }
    return null
  }

  addQueuedParticles () {
    for (let p of this.queuedParticlesToAdd) this.particles.push(p)
    this.queuedParticlesToAdd = []
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
    let grid = []
    const numGridsX = Math.ceil(this.dimensions.x / this.collisionsGridSize)
    const numGridsY = Math.ceil(this.dimensions.y / this.collisionsGridSize)
    for (let x = 0; x < numGridsX; x++) {
      grid[x] = []
      for (let y = 0; y < numGridsY; y++) {
        grid[x].push([])
      }
    }
    for (let particle of this.particles) {
      if (isNaN(particle.pos.x)) console.log(particle)
      grid[particle.currentGrid.x][particle.currentGrid.y].push(particle)
    }

    for (let row of grid) {
      for (let square of row) {
        for (let i = 0; i < square.length; i++) {
          let p1 = square[i]
          for (let j = i + 1; j < square.length; j++) {
            let p2 = square[j]
            if (p1.isColliding(p2)) {
              let reaction = this.mechanism.checkCollidingPair(p1.species, p2.species)
              if (reaction !== null && p1.getKineticEnergy() + p2.getKineticEnergy() >= reaction.activationEnergy) {
                if (p1.removed || p2.removed) continue
                this.reactParticles(p1, p2, reaction)
              }
              p1.bounceOff(p2)
            }
          }
        }
      }
    }
  }

  kineticEnergyToSpeed (ke, mass) {
    return Math.sqrt(2 * ke / mass)
  }

  reactParticles (p1, p2, reaction) {
    let transitionStateVel = new Vector().fromAngle(Math.random() * 2 * Math.PI, this.kineticEnergyToSpeed(p1.getKineticEnergy() + p2.getKineticEnergy() - reaction.activationEnergy, p1.mass + p2.mass))
    let transitionState = new Particle(new Species('transition', '#ff00ff', p1.mass + p2.mass), p1.pos, transitionStateVel, true)
    transitionState.inputEnergy = p1.getKineticEnergy() + p2.getKineticEnergy()
    transitionState.decayProducts = reaction.products
    transitionState.decayEnergy = reaction.activationEnergy - reaction.deltaH
    transitionState.lifetime = CONSTANTS.TRANSITION_STATE_LIFETIME
    this.queuedParticlesToAdd.push(transitionState)
    p1.removed = p2.removed = true
    this.temperature += -(reaction.deltaH) / (this.particles.length * CONSTANTS.GAS_CONSTANT * 5)
  }

  clearRemovedParticles () {
    let newParticleList = []
    for (let p of this.particles) {
      if (!p.removed) newParticleList.push(p)
    }
    this.particles = newParticleList
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
      // if (particle.vel.mag() > getRmsGasSpeed(this.temperature, particle.mass)) {
      //   particle.vel.scale(0.9999)
      // } else {
      //   particle.vel.scale(1.0001)
      // }
      if (particle.isTransitionState) {
        particle.lifetime--
        if (particle.lifetime % 10 === 0) particle.colour = '#' + Math.floor(Math.random() * 16777215).toString(16)
        if (particle.lifetime <= 0) {
          let keForEachParticle = (particle.getKineticEnergy() + particle.decayEnergy) / particle.decayProducts.length
          let n = 0
          let initial = Math.random() * 2 * Math.PI
          for (let decayProduct of particle.decayProducts) {
            let angle = n * (Math.PI * 2) / particle.decayProducts.length + initial
            let offset = new Vector().fromAngle(angle, particle.radius)
            let vel = new Vector().fromAngle(angle, this.kineticEnergyToSpeed(keForEachParticle, decayProduct.mass))
            this.addParticle(decayProduct, particle.pos.add(offset, true), vel)
            n++
          }
          particle.removed = true
        }
      }
    }
    this.resolveWallCollisions()
    this.updateParticleGrid()
    this.resolveParticleCollisions()
    this.clearRemovedParticles()
    this.addQueuedParticles()
  }

  getComposition () {
    let speciesCount = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0
    }
    for (let particle of this.particles) {
      speciesCount[particle.species]++
    }
    return speciesCount
  }

  getTotalKE () {
    let total = 0
    for (let particle of this.particles) total += particle.getKineticEnergy()
    return total
  }

  getTemperature () {
    return (2 * this.getTotalKE() / this.particles.length) / CONSTANTS.GAS_CONSTANT
  }
}

function makeCounter () {
  let i = 0
  return function () {
    return i++
  }
}
