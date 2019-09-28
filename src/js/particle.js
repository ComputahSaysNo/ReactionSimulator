import Vector from '@/js/vector'

export default class Particle {
  constructor (species, pos = new Vector(), vel = new Vector(), isTransitionState = false, id = 0) {
    this.id = id
    this.species = species.name
    this.radius = species.radius
    this.mass = species.mass
    this.colour = species.colour
    this.pos = pos
    this.vel = vel
    this.removed = false
    this.currentGrid = new Vector(0, 0)
    this.isTransitionState = isTransitionState
  }

  isColliding (otherParticle) {
    return (this.radius + otherParticle.radius) ** 2 >= this.pos.differenceSq(otherParticle.pos)
  }

  bounceOff (otherParticle) {
    let deltaX = this.pos.subtract(otherParticle.pos, true)
    let deltaV = this.vel.subtract(otherParticle.vel, true)
    let m1 = this.mass
    let m2 = otherParticle.mass
    let deltaXmag = deltaX.mag()
    if (deltaXmag === 0) return

    let resolveIntersection = deltaX.scale(((this.radius + otherParticle.radius) - deltaX.mag()) / deltaX.mag(), true)
    this.pos.add(resolveIntersection.scale(0.5, true))
    otherParticle.pos.add(resolveIntersection.scale(-0.5, true))

    this.vel.subtract(deltaX.scale((2 * m2 * deltaV.dot(deltaX)) / ((m1 + m2) * deltaX.magSq()), true))
    deltaX.scale(-1)
    deltaV.scale(-1)
    otherParticle.vel.subtract(deltaX.scale((2 * m1 * deltaV.dot(deltaX)) / ((m1 + m2) * deltaX.magSq()), true))
  }

  getKineticEnergy () {
    return 0.5 * this.mass * this.vel.magSq()
  }
}
