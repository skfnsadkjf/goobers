console.log('hello')

const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );
const tileGrassImage = document.getElementById( "tileGrass" );

class Map {
    constructor(dimensions) {
        this.dimensions = dimensions
        this.data = Array.from({length: dimensions}, () => {
            return Array.from({length: dimensions}, () =>
                Math.random() > 0.2 ? '.' : '#'
            )
        })
    }
    get(coords) {
        return this.data[coords[0]][coords[1]];
    }
    print(entities) {
        // Build up an array of strings which will represent the map
        let print_arr = Array.from( { "length" : this.dimensions } , v => "" );
        this.data.forEach( ( col , x ) => {
            col.forEach( ( v , y ) => {
                let drawhero = entities.some(v => {
                    return v.pos[0] == x && v.pos[1] == y
                })
                print_arr[y] += drawhero ? '%' : v

            } );
        } );
        // Print our array of strings
        console.log( print_arr.join( "\n" ) );
    }
    tileIsPassable( coords ) {
        if (coords[0] >= 0 &&
            coords[1] >= 0 &&
            coords[0] < this.dimensions &&
            coords[1] < this.dimensions) {
            return this.get(coords) != "#";
        } else {
            // Out of bounds
            return false
        }
    }
}

const TILE_X = 65
const TILE_Y = 53
const TILE_X2 = Math.floor(TILE_X * 0.5)
function draw( map ) {
    console.log( tileGrassImage );
    for (y = 0; y < map.dimensions; y++) {
        for (x = 0; x < map.dimensions; x++) {
            let z = (y % 2) * TILE_X2
            let drawX = TILE_X * x + z;
            let drawY = TILE_Y * y;
            ctx.drawImage( tileGrassImage , drawX , drawY );
        }
    }
}

function add(c1, c2) {
    return [c1[0] + c2[0], c1[1] + c2[1]]
}

function attemptMove(map, hero, delta) {
    let new_coords = add(hero.pos, delta)
    if (map.tileIsPassable(new_coords)) {
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
    map.print( [hero] );
})

let hero = {'pos': [0,0]}
let map = new Map(10)
tileGrassImage.addEventListener( "load" , e => draw( map ) );
map.print( [hero] );
