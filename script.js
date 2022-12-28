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

  // Game constants
  const POINTS_PER_LEVEL = 100;
  
  // Map dimensions
  const COLS = 80;
  const ROWS = 60;
  const TILE_DIM = 10;

  // Tile codes and colors
  const WALL_CODE = 0;
  const FLOOR_CODE = 1;
  const PLAYER_CODE = 2;
  const ENEMY_CODE = 3;
  const POTION_CODE = 4;
  const WEAPON_CODE = 5;
  
  const TILE_COLORS = [

    // wall
    'grey',

    // floor
    'white',

    // player
    'blue',

    // enemy
    'red',

    // health potion
    'green',

    // weapon
    'orange'
  ];


let SHADOW_CODE = 0;
let VISIBLE_CODE = 1;

// Game elements
const TOTAL_ENEMIES = 10;
const STARTING_POTIONS_AMOUNT = 4;
const STARTING_WEAPONS_AMOUNG = 3;

// Enemy & potions helpers 
// possible health that enemies can have
const ENEMIES_HEALTH = [30, 30, 30, 30, 40, 40, 60, 80];

// possible damage that enemies can inflict
const ENEMIES_DAMAGE = [30, 30, 30, 30, 40, 40, 60, 80];

// potions heal pt
const POTIONS = [10, 20, 30, 40, 50];


// Weapons
const WEAPONS = [{
    name: 'Rusty Dagger',
    damage: 20
},
{
    name: 'Iron Sword',
    damage: 40
},
{
    name: 'Light Brand',
    damage: 75
},
{
    name: 'Binding Sword',
    damage: 120
}
];

// Visibility
const VISIBILITY = 3;

// Game markup
function createDOM() {
  let container = document.getElementById('container');
  let hud = document.createElement('ul');
  hud.id = 'hud';

  let labels = [
    'XP',
    'Level',
    'Health',
    'Weapon',
    'Damage',
    'Enemies'
  ];
  
  for (let label of labels) {
    hud = addStat(label, hud);
  }
  
  // add the heads-up display
  container.appendChild(hud);

  // Adding the game map
  let canvas = document.createElement('canvas');
  canvas.id = 'grid';

  const tileDim = 10;
  canvas.height = ROWS*tileDim;
  canvas.width = COLS*tileDim;

  container.appendChild(canvas);

  // create the button
  let btn = document.createElement('button');
  btn.className = 'toggle';
  btn.textContent = 'Toggle Shadow';
  container.appendChild(btn);

  function toggleShadow() {
  game.isShadowToggled = !game.isShadowToggled;
  }

  btn.addEventListener('click', toggleShadow);
}

/**
 * @param {Sring} label - the visible label of the stat
 * @param {HTMLElement} container - the parent container we add it to
 */ 

function addStat(label, container) {
  let el = document.createElement('li');
  let id = label.toLowerCase();
  let value = '0';
  el.innerHTML = `<label>${label}</label>: <span id="${id}" ${value}></span>`;
  container.appendChild(el);
  return container;
}


var game = null;
var player = null;

function init() {
    createDOM();
    game = new Game();

    game.canvas = document.getElementById('grid');
    game.context = game.canvas.getContext('2d');

    console.log(game);

    startGame();

    // keyboard 
    addKeyboardListener();
}

function startGame() {
  generateMap();

  setTimeout(gameSetUp, 1500);

  function gameSetUp() {

    generatePlayer();
    generateEnemies(TOTAL_ENEMIES);

    generateItems(STARTING_POTIONS_AMOUNT, POTION_CODE);
    generateItems(STARTING_WEAPONS_AMOUNG, WEAPON_CODE);

    drawMap(0, 0, COLS, ROWS);

    updateStats();
  }
}

// generating teh map
function generateMap() {

  // generate a solid wall
  for (let row = 0; row < ROWS; row++) {

    // add a new row
    game.map.push([]);

    for (let col = 0; col < COLS ; col++) {

      // add a wall tile to the row
      game.map[row].push(WALL_CODE);
    }
  }
  
  // digger
  let pos = {
    x: COLS/2,
    y: ROWS/2
  }

  const ATTEMPTS = 30000;
  const MINIMUM_TILE_COUNT = 1000;
  const MAX_PENALTIES_COUNT = 1000;
  const OUTER_LIMIT = 3;

  const randomDirection = () => Math.random() <= 0.5 ? -1 : 1;
  let tiles = 0, penalties = 0;

  for (let i = 0; i < ATTEMPTS; i++) {

    // choose an axis to dig in
    let axis = Math.random() <= 0.5 ? 'x' : 'y';

    // get the number of rows or columns dpending on the axis
    let numCells = axis == 'x' ? COLS : ROWS;

    // choose the positive or negative direction
    pos[axis] += randomDirection();

    // if we are on the far left or far right, find another value.
    // we don't want to dig here so let's find a way to get out
    while (pos[axis] < OUTER_LIMIT || pos[axis] >= numCells - OUTER_LIMIT) {

      pos[axis] += randomDirection();
      penalties++;

      if (penalties > MAX_PENALTIES_COUNT) {
        if (tiles >= MINIMUM_TILE_COUNT) {
          return;
        }
        
        pos.x = COLS/2;
        pos.y = ROWS/2;
      }
    }

    let {x, y} = pos;

    // add floor tile
    if (game.map[y][x] != FLOOR_CODE) {
      game.map[y][x] = FLOOR_CODE;

      tiles++;
    }
    penalties = 0;
    
  } // end loop
};


/**
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 */ 
function drawObject(x, y, color) {
  game.context.beginPath();
  game.context.rect(x * TILE_DIM, y * TILE_DIM, TILE_DIM, TILE_DIM);
  game.context.fillStyle = color;
  game.context.fill();
}

// draw object
function drawMap(startX, startY, endX, endY) {

  let colors = [
     // wall
     'grey',
     // floor
     'white',
     // player
     'blue',
     // enemy
     'red',
     // health drop
     'green',
     // weapon
     'orange'
  ];

  // loop through all cells of the map
  for (let row = startY; row < endY; row++) {

     for (let col = startX; col < endX; col++) {

        let c_idx = game.map[row][col];

        let color = colors[c_idx];
        
        drawObject(col, row, color);

     } // end loop
  }
}

function addObjToMap(coords, tileCode) {
  game.map[coords.y][coords.x] = tileCode
}

function generateValidCoords() {
  let x, y;

  do {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  }

  while (game.map[y][x] != FLOOR_CODE);

  return {
    x: x,
    y: y
  }
}

function generatePlayer() {
  let coords = generateValidCoords();

  // new player
  player = new Player(1, 100, WEAPONS[0], coords, 30);

  addObjToMap(player.coords, PLAYER_CODE);
}

// generate enemies

function pickRandom(arr) {
  let idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function generateEnemies(amount) {
  for (let i = 0; i < amount; i++) {
    let coords = generateValidCoords();
    
    let health = pickRandom(ENEMIES_HEALTH);
    let damage = pickRandom(ENEMIES_DAMAGE);
    
    let enemy = new Enemy(health, coords, damage);
    game.enemies.push(enemy);

    addObjToMap(coords, ENEMY_CODE);
  }
}


// Items: weapons and potions
function generateItems(quantity, tileCode) {
  for (let i = 0; i < quantity; i++) {
    let coords = generateValidCoords();
    addObjToMap(coords, tileCode);

    let color = TILE_COLORS[tileCode];

    drawObject(coords.x, coords.y, color);
  }
}


// Player movement
function removeObjFromMap (x, y) {
  game.map[y][x] = FLOOR_CODE;
}

function updatePlayerPosition(oldX, oldY, newX, newY) {
  removeObjFromMap(oldX, oldY);

  game.map[newY][newX] = PLAYER_CODE;

  player.coords = {
    x: newX,
    y: newY
  }
}

function addKeyboardListener() {
  document.addEventListener('keydown', function(e) {
     var x = player.coords.x;
     var y = player.coords.y;
     var oldX = player.coords.x;
     var oldY = player.coords.y;

     switch (e.which) {
        case 37: // left
           x--;
           break;
        case 38: // up
           y--;
           break;
        case 39: // right
           x++;
           break;
        case 40: // down
           y++;
           break;
        default:
           return; // exit this handler for other keys
     }
     // check if next spot is enemy
     if (game.map[y][x] == ENEMY_CODE) {

        const matching_coords = (enemy) => {
           return enemy.coords.x == x && enemy.coords.y == y;
        }
        let enemy = game.enemies.find(matching_coords);

        fightEnemy(enemy);
     } 
     else if (game.map[y][x] != WALL_CODE) {
        // if next spot is potion
        if (game.map[y][x] == POTION_CODE) {

           player.health += pickRandom(POTIONS);

           removeObjFromMap(x, y);
           generateItems(1, POTION_CODE);
        // if next spot is weapon
        } else if (game.map[y][x] == WEAPON_CODE) {

           player.weapon = pickRandom(WEAPONS);

           removeObjFromMap(x, y);
           generateItems(1, WEAPON_CODE);
        }
        // update player position
        updatePlayerPosition(player.coords.x, player.coords.y, x, y);

        updateStats();

        let left = oldX - VISIBILITY - 1;
        let top = oldY - VISIBILITY - 1;

        let right = x + VISIBILITY + 2;
        let bot = y + VISIBILITY + 2 ;

        drawMap(left, top, right, bot);
     }
     e.preventDefault(); // prevent the default action (scroll / move caret)
  });
}

// upddating game stats
function updateStats() {

  let player_props = ['xp', 'level', 'health'];

  for (var prop of player_props) {
     let el = document.getElementById(prop);

     el.textContent = player[prop];
  }
  let weapon_props = [{
        domId: 'weapon',
        key: 'name',
     },
     {
        domId: 'damage',
        key: 'damage'
     }
  ];
  for (var prop of weapon_props) {

     let {domId,key} = prop;

     let el = document.getElementById(domId);

     el.textContent = player.weapon[key];
  }
  let enemyStats = document.querySelector("#enemies")

  enemyStats.textContent = game.enemies.length;
}


// enemy combat

function gameOver() {
  alert('GAME OVER');
  game.reset;
  startGame();
};

function fightEnemy(enemy) {
  if (player.health - enemy.damage <= 0) {
    gameOver();
    return;
  }

  if (enemy.health - player.weapon.damage <= 0) {
    enemyDefeated(enemy);
  }

  else {
    enemy.health -= player.weapon.damage
  }
  player.health -= enemy.damage;
  updateStats();
}

// enemy defeated

function enemyDefeated(enemy) {

  // remove enemy from  2D array
  removeObjFromMap(enemy.coords.x, enemy.coords.y);
  
  // set up the draw parameters for readability.
  let left = enemy.coords.x - 1;
  let top = enemy.coords.y - 1
  let right = enemy.coords.x + 1;
  let bot = enemy.coords.y + 1;
  
  // remove ane enemy from the visible map.
  drawMap(left, top, right, bot);

  // add experience points
  player.xp += parseInt((enemy.damage + enemy.health)/2);

  // calculate the level in points. Level 1 has no experience so machine-wise it is level 0.
  let level_in_points = POINTS_PER_LEVEL * (player.level - 1)

  // level up if needed.
  if (player.xp - level_in_points >= POINTS_PER_LEVEL) {
     player.level++;
  }

  // remove enemy from enemies array
  let e_idx = game.enemies.indexOf(enemy);

  // remove enemy from array
  game.enemies.splice(e_idx, 1);

  // update stats
  updateStats();

  // if no enemies, user wins
  if (game.enemies.length == 0) {
     userWins();
  }
}

function userWins() {
  alert("YOU CONQUERED THE DUNGEON!");
  game.reset();
  startGame();
};

init();


