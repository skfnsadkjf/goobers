import { TILE_X , TILE_Y } from "./goobers.js";
export { draw };
const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );
canvas.height = window.innerHeight - 5;
canvas.width = window.innerWidth;
const tile = {
	"grass" : 0 ,
	"rock" : 1 ,
	"dirt" : 2 ,
	"water" : 3 ,
	"border" : 4 ,
	"hero" : 5 ,
	"gobbo" : 5 ,
}
const tileGraphics = Object.keys( tile ).map( v => document.getElementById( "tile_" + v ) );
function coordsToScreenPos( x , y ) {
	let z = (y % 2) * Math.floor( TILE_X * 0.5 );
	let drawX = TILE_X * x + z;
	let drawY = TILE_Y * y;
	return [drawX , drawY];
}
function draw( world ) {
	console.log( "dongs" );
	// get hexes in area then only draw those.
	let minX = 10;
	let minY = 10;
	let maxX = screen.sizeX - 300;
	let maxY = screen.sizeY - 100;
	let amountX = Math.ceil( ( maxX - minX ) / TILE_X );
	let amountY = Math.ceil( ( maxY - minY + TILE_Y / 3 ) / TILE_Y );
	for ( let y = 0; y < amountY && y < world.dimensions; y++ ) {
		for ( let x = 0; x < amountX && x < world.dimensions; x++ ) {
			let [drawX , drawY] = coordsToScreenPos( x , y );
			let tileId = world.get( [x , y] );
			let t = tileGraphics[tileId];
			ctx.drawImage( t , drawX , drawY );
		}
	}
	// let region = new Path2D();
	// region.rect( 0 , 0 , screen.sizeX , screen.sizeY );
	// region.rect( minX , minY , maxX - minX , maxY - minY );
	// ctx.clip( region , "evenodd" );
	// ctx.fillStyle = "blue";
	// ctx.fillRect( 0 , 0 , screen.sizeX , screen.sizeY );
	world.entities.forEach( entity => {
		let [drawX , drawY] = coordsToScreenPos( entity.pos[0] , entity.pos[1] );
		ctx.drawImage( tileGraphics[tile[entity.tile]] , drawX , drawY );
	} );
}
let screen = {
	"sizeX" : window.innerWidth ,
	"sizeY" : window.innerHeight ,
	"posX" : 0 ,
	"posY" : 0 ,
}
// window.onload = e => { // may be able to remove the window.onload part of this.
	// draw( world );
// }