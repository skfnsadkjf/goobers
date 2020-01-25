export { newWorld };
const neighbours = [[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0]];
function get( x , y ) {
	return this.data[x][y];
}
function set( x , y , tile ) {
	this.data[x][y] = tile;
}
function tileInWorld( x , y ) {
	return x >= 0 && x < this.dimensions && y >=0 && y < this.dimensions;
}
function tileIsPassable( x , y ) {
	return this.tileInWorld( x , y ) && this.get( x , y ) != 3;
}
function getNeighbour( x , y , dx , dy ) {
	if ( ( y % 2 == 0 ? -1 : 1 ) == dy ) {
		dx += dy;
	}
	return [x + dx , y + dy];
}
function getNeighbours( x , y ) {
	return neighbours.map( v => getNeighbour( x , y , ...v ) );
}
function makeData( dimensions ) {
	let data = Array( dimensions ).fill( Array( dimensions ).fill( 0 ) );
	return data.map( v => v.map( () => Math.random() > 0.1 ? 0 : 3 ) );
}
function newWorld( dimensions ) {
	return {
		"data" : makeData( dimensions ) ,
		"entities" : [] ,
		"dimensions" : dimensions ,
		"get" : get ,
		"set" : set ,
		"tileInWorld" : tileInWorld ,
		"tileIsPassable" : tileIsPassable ,
		"getNeighbour" : getNeighbour ,
		"getNeighbours" : getNeighbours ,

	}
}
