export default class Mechanism {
  constructor () {
    this.reactions = []
  }

  addStep (reactants, products, activationEnergy, deltaH, reversible = true) {
    if (activationEnergy < 0) throw new Error('Activation energy must be positive!')
    if (activationEnergy < deltaH) throw new Error('Activation energy must be greater than delta H!')
    let forwardReaction = {
      reactants: reactants,
      products: products,
      activationEnergy: activationEnergy,
      deltaH: deltaH
    }
    this.reactions.push(forwardReaction)
    if (reversible) {
      let reverseReaction = {
        reactants: products,
        products: reactants,
        activationEnergy: activationEnergy - deltaH,
        deltaH: -deltaH
      }
      this.reactions.push(reverseReaction)
    }
  }

  checkCollidingPair (species1, species2) {
    for (let reaction of this.reactions) {
      let reactants = reaction.reactants
      if (reaction.reactants.length === 1) {
        if (reactants[0].name === species1 || reactants[0].name === species2) {
          return reaction
        }
      } else {
        if ((reactants[0].name === species1 && reactants[1].name === species2) ||
          (reactants[0].name === species2 && reactants[1].name === species1)) {
          return reaction
        }
      }
    }
    return null
  }
}
