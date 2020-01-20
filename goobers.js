// import "./pathfinding.js"
import { pathfind } from "./pathfinding.js";
import { draw } from "./canvas.js";
export { TILE_X , TILE_Y , addDeltaPlusOffset };
const mapSize = 25;
const TILE_X = 60;
const TILE_Y = Math.floor( TILE_X * 0.866025 ); // Represents height to begin tiling, NOT tile height. Assumes regular hexagon.
const symbols = ['.', '#' , "$"]
const MOVE_SPEED = 20;
class World {
	constructor(dimensions) {
		this.dimensions = dimensions
		this.data = Array.from({length: dimensions}, () => {
			return Array.from({length: dimensions}, () => {
				return Math.random() > 0.3 ? 0 : 3;
			} );
		} );
		this.entities = [];
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
			return this.get(coords) != 3;
		} else {
			// Out of bounds
			return false
		}
	}
}
function addDeltaPlusOffset( x , y , dx , dy ) {
	let isEven = y % 2 == 0;
	if ( isEven && dy == -1 ) {
		dx -= 1;
	}
	if ( !isEven && dy == 1 ) {
		dx += 1;
	}
	return [x + dx , y + dy];
}
function attemptMove(world, hero, delta) {
	let newCoords = addDeltaPlusOffset( ...hero.pos , ...delta );
	if ( world.tileIsPassable( newCoords ) ) {
		hero.pos = newCoords;
	}
}
function screenPosToCoords( screenX , screenY ) {
	let y = Math.floor( screenY / TILE_Y );
	let offsetX = screenX - ( y % 2 ) * TILE_X / 2;
	let x = Math.floor( offsetX / TILE_X );
	let dongs = ( offsetX % TILE_X - TILE_X / 2 ) * 0.577350; // 0.577350 normalises TILE_X / 2 to TILE_Y / 3.
	if ( Math.abs( dongs ) > screenY % TILE_Y ) {
		let deltaX = ( dongs < 0 ) ? 0 : 1;
		[x , y] = addDeltaPlusOffset( x , y , deltaX , -1 );
	}
	return [x , y];
}
function moveGuy( path ) {
	if ( path[0] ) {
		hero.pos = path.pop();
		draw( world );
		window.setTimeout( moveGuy , MOVE_SPEED , path );
	}
}
function onmousemove( e ) {
	let [x , y] = screenPosToCoords( e.clientX , e.clientY );
	if ( border.pos[0] != x || border.pos[1] != y ) {
		border.pos = [x , y];
		draw( world );
	}
}
function onclick( e ) {
	if ( e.button == 0 ) {
		let path = pathfind( screenPosToCoords( e.clientX , e.clientY ) , hero , world );
		moveGuy( path );
		draw( world );
	}
}
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
	draw( world );
}

let world = new World( mapSize )
let hero = { "pos" : [0 , 0] , "tile" : "hero" , "army" : Array( 7 ).push( ["gobbo" , 10] ) };
let border = { "pos" : [0 , 0] , "tile" : "border" };
let creature = { "pos" : [10 , 10] , "tile" : "gobbo" , "army" : Array( 7 ).push( ["gobbo" , 5] ) };
world.entities.push( hero , border , creature );
document.addEventListener( "click" , onclick );
document.addEventListener( "mousemove" , onmousemove );
document.addEventListener('keydown', oninput );
draw( world );
