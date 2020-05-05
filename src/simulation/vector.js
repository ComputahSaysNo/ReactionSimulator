class Vector {
  /* A class representing a Vector in 2D Euclidean space
  The add, subtract and scale methods by default act on the vector in place.
  To return a new vector, set the makeNew flag to true */

  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  fromAngle (angle, length = 1) {
    // Alternative constructor using angle and magnitude format. Angle is in radians clockwise from positive x axis
    this.x = length * Math.cos(angle)
    this.y = length * Math.sin(angle)
    return this
  }

  clone () {
    // Returns a copy of the vector
    return new Vector(this.x, this.y)
  }

  add (otherVector, makeNew = false) {
    // Adds another vector to this one
    if (makeNew) return this.clone().add(otherVector, false)
    this.x += otherVector.x
    this.y += otherVector.y
    return this
  }

  subtract (otherVector, makeNew = false) {
    // Subtracts another vector from this one
    if (makeNew) return this.clone().subtract(otherVector, false)
    this.x -= otherVector.x
    this.y -= otherVector.y
    return this
  }

  scale (scalar, makeNew = false) {
    // Increases the length of a vector by the specified scalar
    if (makeNew) return this.clone().scale(scalar, false)
    this.x *= scalar
    this.y *= scalar
    return this
  }

  dot (otherVector) {
    // Returns the dot (scalar) product of this vector with another vector
    return this.x * otherVector.x + this.y * otherVector.y
  }

  getAngle () {
    // Get the angle the vector is pointing (in radians clockwise from the positive x axis)
    return Math.atan2(this.y, this.x)
  }

  magSq () {
    // Get the squared magnitude of the vector (faster than mag() for simple comparisons)
    return this.x * this.x + this.y * this.y
  }

  mag () {
    // Get the magnitude of the vector
    return Math.sqrt(this.magSq())
  }

  differenceSq (otherVector) {
    return (this.x - otherVector.x) ** 2 + (this.y - otherVector.y) ** 2
  }
}

export default Vector
