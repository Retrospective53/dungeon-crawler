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