import { addDeltaPlusOffset } from "./goobers.js";
export { draw , screenPosToCoords };
const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );
const tileWidth = 60;
const tileHeight = 51;
const tileHeightTrue = 68;
const worldWindowOffsetWidth = 50;
const worldWindowOffsetHeight = 50;
const tile = {
	"grass" : 0 ,
	"rock" : 1 ,
	"dirt" : 2 ,
	"water" : 3 ,
	"outline" : 4 ,
	"hero" : 5 ,
	"gobbo" : 6 ,
	"border" : 7 ,
}
const tileGraphics = Object.keys( tile ).map( v => document.getElementById( "tile_" + v ) );
function setSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
function screenPosToCoords( screenX , screenY ) {
	screenX -= worldWindowOffsetWidth;
	screenY -= worldWindowOffsetHeight;
	let y = Math.floor( screenY / tileHeight );
	let offsetX = screenX - ( y % 2 ) * tileWidth / 2;
	let x = Math.floor( offsetX / tileWidth );
	let dongs = ( offsetX % tileWidth - tileWidth / 2 ) * 0.577350; // 0.577350 normalises tileWidth / 2 to tileHeight / 3.
	if ( Math.abs( dongs ) > screenY % tileHeight ) {
		let deltaX = ( dongs < 0 ) ? 0 : 1;
		[x , y] = addDeltaPlusOffset( x , y , deltaX , -1 );
	}
	return [x , y];
}
function coordsToScreenPos( x , y ) {
	let z = (y % 2) * Math.floor( tileWidth * 0.5 );
	let drawX = tileWidth * x + z;
	let drawY = tileHeight * y;
	drawX += worldWindowOffsetWidth;
	drawY += worldWindowOffsetHeight;
	return [drawX , drawY];
}
function draw( world ) {
	let worldWindowWidth = canvas.width - 600 - worldWindowOffsetWidth; // minus right offset and left offset.
	let worldWindowHeight = canvas.height - 100 - worldWindowOffsetHeight; // minus bottom offset and top offset.
	let tilesToShowX = Math.ceil( worldWindowWidth / tileWidth );
	let tilesToShowY = Math.ceil( worldWindowHeight / tileHeight );
	for ( let y = -1; y < tilesToShowY; y++ ) {
		for ( let x = -1; x < tilesToShowX; x++ ) {
			let [drawX , drawY] = coordsToScreenPos( x , y );
			let outOfBounds = x < 0 || y < 0 || x >= world.dimensions || y >= world.dimensions;
			let tileId = outOfBounds ? 7 : world.get( [x , y] );
			let t = tileGraphics[tileId];
			let sx = Math.max( 0 , worldWindowOffsetWidth - drawX );
			let sy = Math.max( 0 , worldWindowOffsetHeight - drawY );
			let sWidth = Math.min( tileWidth - sx , worldWindowWidth + worldWindowOffsetWidth - drawX );
			let sHeight = Math.min( tileHeightTrue - sy , worldWindowHeight + worldWindowOffsetHeight - drawY );
			if ( sWidth > 0 && sHeight > 0 ) {
				ctx.drawImage( t , sx , sy , sWidth , sHeight , drawX + sx , drawY + sy , sWidth , sHeight );
			}
		}
	}
	world.entities.forEach( entity => {
		let [drawX , drawY] = coordsToScreenPos( entity.pos[0] , entity.pos[1] );
		ctx.drawImage( tileGraphics[tile[entity.tile]] , drawX , drawY );
	} );
	ctx.strokeStyle = "green";
	ctx.lineWidth = 10;
	ctx.strokeRect( 0 , 0 , canvas.width , canvas.height );
}
window.addEventListener( "resize" , setSize );
setSize();
