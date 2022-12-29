/**
 * Creates a new player. 
 * @class
 * 
 * @property {number} level - starts at one and progresses
 * @property {number} health - keep this above zero
 * @property {string} weapon - ties to an object with a damage rating
 * @property {object} coords - location on the grid
 * @property {number} xp - experience points
 */ 

class Player {
    constructor(level, health, weapon, coords, xp) {
        this.level = level;
        this.weapon = weapon;
        this.xp = xp;
        this.health = health;
        this.coords = coords;
    }
}

/**
 * Creates a new enemy. 
 * @class
 * 
 * @property {Number} health
 * @property {Object} coords
 * @property {Number} damage
 */ 
class Enemy {
    constructor(health, coords, damage) {
      this.health = health;
      this.coords = coords;
      this.damage = damage;
    }
  }

  class Game {
    constructor() {
        this.map = [];
        this.shadow = [];
        this.isShadowToggled = false;
        this.enemies = [];
        this.canvas = null;
        this.context = null;
    }
  }

  /**
 * Reset all level-specific properties
 */ 

  Game.prototype.reset = function() {
    this.enemies = [];
    this.map = [];
    this.shadow = [];
  }

  export {
    Player,
    Enemy,
    Game
  }