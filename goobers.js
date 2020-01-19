
const mapSize = 10;

const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );
const alienBlueImage = document.getElementById( "alienBlue" );
const TILE_X = 65;
const TILE_Y = 53; // Represents height to begin tiling, NOT tile height.
const TILE_R = Math.round( TILE_Y / 3 ); // represents top height of tile before maximum width is reached. Assumes regular hexagon.
const symbols = ['.', '#' , "$"]
const tile = {
	"grass" : 0 ,
	"rock" : 1 ,
	"dirt" : 2 ,
}
const tileGraphics = Object.keys( tile ).map( v => document.getElementById( "tile_" + v ) );
class World {
	constructor(dimensions) {
		this.dimensions = dimensions
		this.data = Array.from({length: dimensions}, () => {
			return Array.from({length: dimensions}, () => {
				return Math.random() > 0.1 ? tile.grass : tile.rock;
			} );
		} );
		this.entities = [hero];
	}
	get(coords) {
		return this.data[coords[0]][coords[1]];
	}
	set( coords , tileType ) {
		this.data[coords[0]][coords[1]] = tileType;
	}
	print(entities) {
		// Build up an array of strings which will represent the world
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
			return this.get(coords) != tile.rock;
		} else {
			// Out of bounds
			return false
		}
	}
}
/** converts game world x,y to canvas x,y  */
function coordsToScreenPos( x , y ) {
	let z = (y % 2) * Math.floor( TILE_X * 0.5 );
	let drawX = TILE_X * x + z;
	let drawY = TILE_Y * y;
	return [drawX , drawY];
}
function draw( world ) {
	for (y = 0; y < world.dimensions; y++) {
		for (x = 0; x < world.dimensions; x++) {
			let [drawX , drawY] = coordsToScreenPos( x , y );

			let tileId = world.get( [x , y] );
			let t = tileGraphics[tileId];
			if ( tileId == tile.rock ) {
				drawY -= 8
			}
			ctx.drawImage( t , drawX , drawY );
		}
	}
	world.entities.forEach( v => {
		let [drawX , drawY] = coordsToScreenPos( v.pos[0] , v.pos[1] );
		ctx.drawImage( alienBlueImage , drawX , drawY );
	} );
}

function add(c1, c2) {
	return [c1[0] + c2[0], c1[1] + c2[1]];
}


function addDeltaPlusOffset( pos , delta ) {
	let isEven = pos[1] % 2 == 0;
	if ( isEven && delta[1] == -1 ) {
		delta[0] -= 1;
	}
	if ( !isEven && delta[1] == 1 ) {
		delta[0] += 1;
	}
	return add( pos , delta );
}
function attemptMove(world, hero, delta) {
	let newCoords = addDeltaPlusOffset( hero.pos , delta );
	if ( world.tileIsPassable( newCoords ) ) {
		hero.pos = newCoords;
	}
}
function onclick( e ) {
	let y = Math.floor( e.clientY / TILE_Y );
	let offsetX = e.clientX - ( y % 2 ) * TILE_X / 2 ;
	let x = Math.floor( offsetX / TILE_X );
	let xr = offsetX % TILE_X;
	let yr = e.clientY % TILE_Y;
	if ( yr < 15 ) {
		if ( xr < TILE_X / 2 ) {
			if ( xr / ( TILE_X / 2 ) + yr / TILE_R <= 1 ) {
				x -= ( y + 1 ) % 2;
				y--;
			}
		}
		else {
			if ( ( xr - TILE_X / 2 ) / ( TILE_X / 2 ) > yr / TILE_R ) {
				x += y % 2;
				y--;
			}
		}
	}
	let coords = [x , y];
	let path = pathfind( coords );
	if ( path ) {
		path = path.map( v => stringToPos( v ) );
		moveGuy( path );
	}
}
function moveGuy( path ) {
	hero.pos = path.pop();
	draw( world );
	if ( path[0] ) {
		window.setTimeout( moveGuy , 100 , path );
	}
}

// =====================
// pathfinding functions
function h( a , b ) {
	return Math.sqrt( ( a[0] - b[0] )**2 + ( a[1] - b[1] )**2 );

}
function getLowestF( open ) {
	let lowestKey = false;
	let lowestValue = Infinity;
	open.forEach( ( v , key ) => {
		if ( v[0] < lowestValue ) {
			lowestValue = v[0];
			lowestKey = key;
		}
	} );
	return lowestKey;
}
function getNeighbours( currentKey ) {
	let coords = currentKey.split( "-" ).map( v => parseInt( v ) );
	let hexOffsets = [[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0]];
	let neighbours = hexOffsets.map( delta => addDeltaPlusOffset( coords , delta ) );
	let validNeighbours = neighbours.filter( v => world.tileIsPassable( v ) );
	return validNeighbours.map( v => v );
}
const posToString = ( pos ) => pos[0] + "-" + pos[1];
const stringToPos = ( str ) => str.split( "-" ).map( v => parseInt( v ) );
function pathfind( endCoords ) {
	const start = posToString( hero.pos );
	const end = posToString( endCoords );
	let open = new Map();
	let closed = new Map();
	let firstH = h( hero.pos , endCoords );
	open.set( start , [firstH , 0 , firstH , false] ); // [f , g , h]
	while ( open.size != 0 ) {
		let currentKey = getLowestF( open );
		let current = open.get( currentKey );
		if ( currentKey == end ) {
			let path = [end];
			let parent = open.get( end )[3];
			while ( parent != start ) {
				path.push( parent );
				console.log( parent );
				parent = closed.get( parent )[3];
			}
			console.log( path );
			return path;
		}
		closed.set( currentKey , open.get( currentKey ) );
		open.delete( currentKey );
		let neighbours = getNeighbours( currentKey );
		neighbours.forEach( coords => {
			let key = posToString( coords );
			if ( closed.has( key ) ) {
				return
			}
			let gScoreNew = current[1] + 1;
			if ( !open.has( key ) || gScoreNew < open.get( key )[1] ) {
				let hScore = h( coords , endCoords );
				let fScore = hScore + gScoreNew
				open.set( key , [fScore , gScoreNew , hScore , currentKey] );
			}
		} );
	}

}
// pathfinding end
// =====================


function oninput( e ) {
	if ( e.key == "f" ) {
		attemptMove(world, hero, [1, 0])
	}
	if ( e.key == "s" ) {
		attemptMove(world, hero, [-1, 0])
	}
	if ( e.key == "r" ) {
		attemptMove(world, hero, [1, -1])
	}
	if ( e.key == "e" ) {
		attemptMove(world, hero, [0, -1])
	}
	if ( e.key == "x" ) {
		attemptMove(world, hero, [-1, 1])
	}
	if ( e.key == "c" ) {
		attemptMove(world, hero, [0, 1])
	}
	if ( e.button == 0 ) {
		onclick( e );
	}
	draw( world );
	// world.print( [hero] );
}

let hero = {'pos': [0,0]}
let world = new World( mapSize )
window.onload = e => {
	canvas.height = window.innerHeight - 3;
	canvas.width = window.innerWidth;
	draw( world );
}
canvas.addEventListener( "click" , oninput );
document.addEventListener('keydown', oninput );
// world.print( [hero] );
