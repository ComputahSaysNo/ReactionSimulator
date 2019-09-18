import Vector from '@/js/vector'
import CONSTANTS from '@/js/constants'

export default class Graphics {
  /* A class binding to a canvas that can be used to draw simulation objects to the screen
  Can handle panning and zooming via mouse events passed to it

  There are two separate coordinate systems that need to be considered, that of the canvas and that of the simulation
  The simOffset and zoom parameters give the conversion between these two.
   */
  constructor (canvas, simulation) {
    this.simulation = simulation

    this.canvas = canvas // The canvas the simulation acts on
    this.ctx = this.canvas.getContext('2d') // The context for this canvas

    // A set of numbers that are used to calculate the zooming of the canvas.
    // Overall zoom is defined as minZoom * zoomMultiplier ^ zoomLevel
    this.zoomLevel = 0
    this.baseZoom = 1
    this.zoom = this.baseZoom // Used as a scaling factor between simulation coordinates and canvas coordinates
    this.zoomMultiplier = CONSTANTS.ZOOM_RATE

    this.setBaseZoom()

    this.simOffset = new Vector()
    this.centerSim()

    this.mouseDown = false
    this.panStartPos = null // Will be set to the value that the user begins panning
  }

  setBaseZoom () {
    this.baseZoom = Math.min(this.canvas.width / this.simulation.dimensions.x, this.canvas.height / this.simulation.dimensions.y) * 0.95
    this.zoom = this.baseZoom * this.zoomMultiplier ** this.zoomLevel
  }

  drawFrame () {
    this.limitPan()
    this.clearCanvas()
    this.drawSimulationBox()
    this.drawParticles()
  }

  simPosToCanvasPos (sPos) {
    // Converts a position in simulation coordinates to where it should be drawn on the canvas
    return sPos.add(this.simOffset, true).scale(this.zoom)
  }

  canvasPosToSimPos (cPos) {
    return cPos.scale(1 / this.zoom, true).subtract(this.simOffset)
  }

  clearCanvas () {
    // Draws a blank rectangle over the whole canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawParticles () {
    // Draws each of the particle objects in particleList to the correct position on the canvas, accounting for zooming and panning

    for (let particle of this.simulation.particles) {
      // Calculate the position on the canvas to draw the particle
      let canvasPos = this.simPosToCanvasPos(particle.pos)

      // Draw the circle
      this.ctx.beginPath()
      this.ctx.arc(canvasPos.x, canvasPos.y, particle.radius * this.zoom, 0, Math.PI * 2)
      this.ctx.closePath()
      this.ctx.fillStyle = particle.colour
      this.ctx.fill()
    }
  }

  drawSimulationBox () {
    let dimensions = this.simulation.dimensions

    // Accounts for minZoom being very small, meaning the grid lines have the thickness specified in constants.js at minimum zoom
    const scale = this.zoom / this.baseZoom

    // Conversions of the coordinates (0, 0) and (simulation.width, simulation.height) to canvas coordinates
    const canvasSimZero = this.simPosToCanvasPos(new Vector(0, 0))
    const canvasSimDimensions = dimensions.scale(this.zoom, true)

    // Draw simulation background
    this.ctx.fillStyle = CONSTANTS.SIMULATION_BG_COLOUR
    this.ctx.fillRect(canvasSimZero.x, canvasSimZero.y, canvasSimDimensions.x, canvasSimDimensions.y)

    // Draws the inner grid
    for (let weight of [CONSTANTS.SIMULATION_SMALL_GRID, CONSTANTS.SIMULATION_BIG_GRID]) {
      this.ctx.fillStyle = weight.COLOUR
      for (let i = ((this.canvasPosToSimPos(new Vector(0, 0)).x) / weight.WIDTH) - 1; i <= ((this.canvasPosToSimPos(new Vector(this.canvas.width, 0)).x) / weight.WIDTH) + 1; i++) {
        let start = this.simPosToCanvasPos(new Vector(Math.floor(i) * weight.WIDTH, 0))
        this.ctx.fillRect(start.x, 0, scale * weight.BORDER_THICKNESS, this.canvas.height)
      }
      for (let i = ((this.canvasPosToSimPos(new Vector(0, 0)).y) / weight.WIDTH) - 1; i <= ((this.canvasPosToSimPos(new Vector(0, this.canvas.height)).y) / weight.WIDTH) + 1; i++) {
        let start = this.simPosToCanvasPos(new Vector(0, Math.floor(i) * weight.WIDTH))
        this.ctx.fillRect(0, start.y, this.canvas.width, scale * weight.BORDER_THICKNESS)
      }
    }

    // Draw the outer box
    this.ctx.fillStyle = CONSTANTS.SIMULATION_OUTER_BOX.COLOUR
    let thickness = CONSTANTS.SIMULATION_OUTER_BOX.BORDER_THICKNESS * scale
    this.ctx.lineWidth = thickness
    this.ctx.strokeRect(canvasSimZero.x - thickness / 2, canvasSimZero.y - thickness / 2, canvasSimDimensions.x + thickness, canvasSimDimensions.y + thickness)
  }

  handleZoom (wheelEvent) {
    // Zooms the canvas in or out from the simulation and adjusts the offset and zoom accordingly

    // Adjusts the zoom level
    (wheelEvent.deltaY < 0) ? this.zoomLevel++ : this.zoomLevel--
    if (this.zoomLevel < 0) this.zoomLevel = 0
    if (this.zoomLevel > CONSTANTS.MAX_ZOOM_LEVEL) this.zoomLevel = CONSTANTS.MAX_ZOOM_LEVEL
    this.newZoom = this.baseZoom * this.zoomMultiplier ** this.zoomLevel

    // Vector magic that makes the canvas zoom in towards where the user scrolled by adjusting the offset
    const boundingRect = this.canvas.getBoundingClientRect()
    this.simOffset.subtract(
      new Vector(wheelEvent.x - boundingRect.left, wheelEvent.y - boundingRect.top).scale(
        (1 / this.zoom - 1 / (this.newZoom))
      )
    )
    this.zoom = this.newZoom
  }

  startPan (mouseDownEvent) {
    this.mouseDown = true
    this.panStartPos = new Vector(mouseDownEvent.x, mouseDownEvent.y)
    this.panStartOffset = this.simOffset.clone()
  }

  doPan (mouseMoveEvent) {
    if (this.mouseDown) {
      this.simOffset = this.panStartOffset.subtract(this.panStartPos.subtract(new Vector(mouseMoveEvent.x, mouseMoveEvent.y), true).scale(1 / this.zoom, true), true)
    }
    this.limitPan()
  }

  endPan () {
    this.mouseDown = false
  }

  centerSim () {
    this.simOffset.x = (this.canvas.width / this.zoom - this.simulation.dimensions.x) / 2
    this.simOffset.y = (this.canvas.height / this.zoom - this.simulation.dimensions.y) / 2
  }

  limitPan () {
    let maxOffset = new Vector(this.canvas.width, this.canvas.height).scale(1 / this.baseZoom).subtract(this.simulation.dimensions).scale(0.5)
    let minOffset = new Vector(this.canvas.width, this.canvas.height).scale(1 / this.zoom).subtract(this.simulation.dimensions).subtract(maxOffset)

    if (this.simOffset.x > maxOffset.x) this.simOffset.x = maxOffset.x
    if (this.simOffset.y > maxOffset.y) this.simOffset.y = maxOffset.y
    if (this.simOffset.x < minOffset.x) this.simOffset.x = minOffset.x
    if (this.simOffset.y < minOffset.y) this.simOffset.y = minOffset.y
  }
}
