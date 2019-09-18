const CONSTANTS = {

  PARTICLE_MASS_AREA_CONVERSION: 1.0, // Scaling factor between a species's mass and its area in the simulation (units^2)
  COLLISION_GRID_SIZE: 50, // Defines the size of the grid system that is used for detecting particle-particle collisions
  GAS_CONSTANT: 1, // Used in various calculations relating molecular speed and temperature

  SIMULATION_BG_COLOUR: '#f1f1f1',

  SIMULATION_OUTER_BOX: {
    COLOUR: '#1f1f1f',
    BORDER_THICKNESS: 3
  },

  SIMULATION_BIG_GRID: {
    COLOUR: '#c6c6c6',
    WIDTH: 100,
    BORDER_THICKNESS: 2
  },

  SIMULATION_SMALL_GRID: {
    COLOUR: '#e1e1e1',
    WIDTH: 10,
    BORDER_THICKNESS: 1
  },

  ZOOM_RATE: 1.1, // The factor by which the simulation graphic is scaled when the user scrolls in or out
  MAX_ZOOM_LEVEL: 20
}

export default CONSTANTS
