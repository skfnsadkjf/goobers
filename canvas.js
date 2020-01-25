import { world } from "./goobers.js";
export { draw , screenPosToCoords };
const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );
const tileWidth = 60;
const tileHeight = 51; // height between tiles
const tileHeightTrue = 68; // actual height of a tile.
const worldWindowOffsetWidth = 25;
const worldWindowOffsetHeight = 25;
const scrollSpeed = 40;
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
let worldWindowWidth;
let worldWindowHeight;
let scrollX = 100;
let scrollY = 100;
let scrollDirectionX = 0;
let scrollDirectionY = 0;
function setSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	worldWindowWidth = canvas.width - worldWindowOffsetWidth - 300; // minus left offset and right offset.
	worldWindowHeight = canvas.height - worldWindowOffsetHeight - 25; // minus top offset and bottom offset.
}
function screenPosToCoords( screenX , screenY ) {
	screenX -= worldWindowOffsetWidth - scrollX;
	screenY -= worldWindowOffsetHeight - scrollY;
	let y = Math.floor( screenY / tileHeight );
	let offsetX = screenX - ( y % 2 ) * tileWidth / 2;
	let x = Math.floor( offsetX / tileWidth );
	let dongs = ( offsetX % tileWidth - tileWidth / 2 ) * 0.577350; // 0.577350 normalises tileWidth / 2 to tileHeight / 3.
	if ( Math.abs( dongs ) > screenY % tileHeight ) {
		let deltaX = ( dongs < 0 ) ? 0 : 1;
		[x , y] = world.getNeighbour( x , y , deltaX , -1 );
	}
	return [x , y];
}
function coordsToScreenPos( x , y ) {
	let z = (y % 2) * Math.floor( tileWidth * 0.5 );
	let drawX = tileWidth * x + z;
	let drawY = tileHeight * y;
	drawX += worldWindowOffsetWidth - scrollX;
	drawY += worldWindowOffsetHeight - scrollY;
	return [drawX , drawY];
}
function drawTile( x , y , t ) {
	let [drawX , drawY] = coordsToScreenPos( x , y );
	let sx = Math.max( 0 , worldWindowOffsetWidth - drawX );
	let sy = Math.max( 0 , worldWindowOffsetHeight - drawY );
	let sWidth = Math.min( tileWidth - sx , worldWindowWidth + worldWindowOffsetWidth - drawX );
	let sHeight = Math.min( tileHeightTrue - sy , worldWindowHeight + worldWindowOffsetHeight - drawY );
	if ( sWidth > 0 && sHeight > 0 ) {
		ctx.drawImage( t , sx , sy , sWidth , sHeight , drawX + sx , drawY + sy , sWidth , sHeight );
	}
}
function draw() {
	let x = Math.floor( scrollX / tileWidth );
	let y = Math.floor( scrollY / tileHeight );
	let tilesToDrawX = x + Math.ceil( worldWindowWidth / tileWidth );
	let tilesToDrawY = y + Math.ceil( worldWindowHeight / tileHeight );
	for ( let y = -1; y <= tilesToDrawY; y++ ) {
		for ( let x = -1; x <= tilesToDrawX; x++ ) {
			let outOfBounds = x < 0 || y < 0 || x >= world.dimensions || y >= world.dimensions;
			let tileId = outOfBounds ? 7 : world.get( x , y );
			let t = tileGraphics[tileId];
			drawTile( x , y , t );
		}
	}
	world.entities.forEach( entity => {
		drawTile( entity.pos[0] , entity.pos[1] , tileGraphics[tile[entity.tile]] );
	} );
	ctx.strokeStyle = "green";
	ctx.lineWidth = 1;
	ctx.strokeRect( worldWindowOffsetWidth , worldWindowOffsetHeight , worldWindowWidth , worldWindowHeight );
	ctx.strokeRect( 0 , 0 , canvas.width , canvas.height );
}
function scroll() {
	if ( scrollDirectionX != 0 || scrollDirectionY != 0 ) {
		let minScrollX = -worldWindowWidth / 2;
		let minScrollY = -worldWindowHeight / 2;
		let maxScrollX = tileWidth * world.dimensions - worldWindowWidth / 2;
		let maxScrollY = tileHeight * world.dimensions - worldWindowHeight / 2;
		scrollX = scrollX + scrollSpeed * scrollDirectionX;
		scrollY = scrollY + scrollSpeed * scrollDirectionY;
		scrollX = Math.max( minScrollX , Math.min( scrollX , maxScrollX ) );
		scrollY = Math.max( minScrollY , Math.min( scrollY , maxScrollY ) );
		draw();
	}
}
function onmousemove( e ) {
	let r = 35;
	scrollDirectionX = e.clientX < r ? -1 : e.clientX > canvas.width - r ? 1 : 0;
	scrollDirectionY = e.clientY < r ? -1 : e.clientY > canvas.height - r ? 1 : 0;
}
window.setInterval( scroll , 50 );
window.addEventListener( "resize" , setSize );
canvas.addEventListener( "mousemove" , onmousemove );
setSize();
