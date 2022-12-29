function searchUndefined() {
    for (let i = 0; i < game.map.length; i++) {
      for (let j = 0; j < game.map[i].length; j++) {
        if (game.map[i][j] === undefined) {
          return console.log(`Found an undefined value at index [${i}, ${j}]`);
        }
        else {
          return 'no undefined';
        }
      }
    }  
  }

  export default searchUndefined;