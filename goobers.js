console.log('hello')

let hero = {'pos': [0,0]}

let map = {
    "dimensions": 10,
    "data" : generateMap( 10 )
}
function generateMap( dimensions ) {
    return Array.from({length: dimensions}, () => {
        return Array.from({length: dimensions}, () =>
            Math.random() > 0.2 ? '.' : '#'
        )
    })
}

function printMap(map, entities) {
    // Build up an array of strings which will represent the map
    let print_arr = Array.from( { "length" : map.dimensions } , v => "" );
    map.data.forEach( ( col , x ) => {
        col.forEach( ( v , y ) => {
            drawhero = entities.some(v => {
                return v.pos[0] == x && v.pos[1] == y
            })
            print_arr[y] += drawhero ? '%' : v

        } );
    } );
    // Print our array of strings
    console.log( print_arr.join( "\n" ) );
}

function tileIsPassable( map , coords ) {
    if (coords[0] >= 0 &&
        coords[1] >= 0 &&
        coords[0] < map.dimensions &&
        coords[1] < map.dimensions) {
        return map.data[coords[0]][coords[1]] != "#";
    } else {
        // Out of bounds
        return false
    }
}
function add(c1, c2) {
    return [c1[0] + c2[0], c1[1] + c2[1]]
}
function attemptMove(map, hero, delta) {
    let new_coords = add(hero.pos, delta)
    if (tileIsPassable(map, new_coords)) {
        hero.pos = new_coords;
    }
}

document.addEventListener('keydown', (e) => {
    console.log('keydown')
    console.log(e)
    if ( e.key == "f") {
        attemptMove(map, hero, [1, 0])
    }
    if ( e.key == "s") {
        attemptMove(map, hero, [-1, 0])
    }
    if ( e.key == "d") {
        attemptMove(map, hero, [0, 1])
    }
    if ( e.key == "e") {
        attemptMove(map, hero, [0, -1])
    }
    // if ( e.key == "s" && hero.pos[0] > 0 ) {
    //     hero.pos[0]--;
    // }
    // if ( e.key == "d" && hero.pos[1] < map_dimensions - 1 ) {
    //     hero.pos[1]++;
    // }
    // if ( e.key == "e" && hero.pos[1] > 0 ) {
    //     hero.pos[1]--;
    // }
    printMap( map , [hero] );
})

printMap(map, [hero])
