import { pathfind } from "./pathfinding.js";
import { draw , screenPosToCoords } from "./canvas.js";
import { newWorld } from "./world.js";
export { world };
const mapSize = 25;
const symbols = ['.', '#' , "$"]
const MOVE_SPEED = 20;
function fight( entity1 , entity2 ) {
	console.log( entity1.army );
	console.log( entity2.army );
	let temp = entity1.army;
	entity1.army -= entity2.army;
	entity2.army -= temp;
	world.entities = world.entities.filter( v => !( "army" in v ) || v.army >= 0 );
	console.log( world.entities );
}
function checkTwoEntitiesInSameSpace() {
	world.entities.forEach( v => {
		if ( v.tile != "hero" && v.tile == "gobbo" && v.pos[0] == hero.pos[0] && v.pos[1] == hero.pos[1] ) {
			fight( hero , v );
		}
	} );
}
function moveGuy( path ) {
	if ( path[0] ) {
		hero.pos = path.pop();
		checkTwoEntitiesInSameSpace();
		draw();
		window.setTimeout( moveGuy , MOVE_SPEED , path );
	}
}
function moveOneSpace( dx , dy ) {
	let convertedDelta = world.getNeighbour( hero.pos[0] , hero.pos[1] , dx , dy );
	let path = pathfind( convertedDelta , hero , world );
	moveGuy( path );
	draw();
}
function onmousemove( e ) {
	let [x , y] = screenPosToCoords( e.clientX , e.clientY );
	if ( outline.pos[0] != x || outline.pos[1] != y ) {
		outline.pos = [x , y];
		draw();
	}
}
function onclick( e ) {
	if ( e.button == 0 ) {
		let path = pathfind( screenPosToCoords( e.clientX , e.clientY ) , hero , world );
		moveGuy( path );
		draw();
	}
}
function onkeydown( e ) {
	if ( e.key == "f" ) {
		moveOneSpace( 1 , 0 );
	}
	if ( e.key == "s" ) {
		moveOneSpace( -1 , 0 );
	}
	if ( e.key == "r" ) {
		moveOneSpace( 1 , -1 );
	}
	if ( e.key == "e" ) {
		moveOneSpace( 0 , -1 );
	}
	if ( e.key == "x" ) {
		moveOneSpace( -1 , 1 );
	}
	if ( e.key == "c" ) {
		moveOneSpace( 0 , 1 );
	}
}

let world = newWorld( mapSize );
let hero = { "pos" : [1 , 1] , "tile" : "hero" , "army" : 10 };
let outline = { "pos" : [0 , 0] , "tile" : "outline" };
let creature = { "pos" : [10 , 10] , "tile" : "gobbo" , "army" : 7 };
let creature1 = { "pos" : [5 , 5] , "tile" : "gobbo" , "army" : 7 };
let creature2 = { "pos" : [5 , 10] , "tile" : "gobbo" , "army" : 7 };
world.entities.push( hero , outline , creature , creature1 , creature2 );
document.addEventListener( "click" , onclick );
document.addEventListener( "mousemove" , onmousemove );
document.addEventListener( "keydown" , onkeydown );
draw();
