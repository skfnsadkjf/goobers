import { addDeltaPlusOffset } from "./goobers.js";
export { pathfind };
const hexOffsets = [[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0]];
const posToString = ( pos ) => pos[0] + "-" + pos[1];
const stringToPos = ( str ) => str.split( "-" ).map( v => parseInt( v ) );
const h = ( a , b ) => Math.sqrt( ( a[0] - b[0] )**2 + ( a[1] - b[1] )**2 );
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
function getNeighbours( currentKey , world ) {
	let coords = currentKey.split( "-" ).map( v => parseInt( v ) );
	let neighbours = hexOffsets.map( delta => addDeltaPlusOffset( ...coords , ...delta ) );
	return neighbours.filter( v => world.tileIsPassable( v ) );
}
function pathfind( endCoords , hero , world ) {
	const start = posToString( hero.pos );
	const end = posToString( endCoords );
	let open = new Map();
	let closed = new Map();
	let firstH = h( hero.pos , endCoords );
	open.set( start , [firstH , 0 , firstH , start] ); // [f , g , h , parent]
	while ( open.size != 0 ) {
		let currentKey = getLowestF( open );
		closed.set( currentKey , open.get( currentKey ) );
		open.delete( currentKey );
		if ( currentKey == end ) {
			let path = [];
			while ( currentKey != start ) {
				path.push( currentKey );
				currentKey = closed.get( currentKey )[3];
				console.log( currentKey );
			}
			console.log( path );
			return path.map( v => stringToPos( v ) );
		}
		let neighbours = getNeighbours( currentKey , world );
		neighbours.forEach( coords => {
			let key = posToString( coords );
			if ( closed.has( key ) ) {
				return
			}
			let gScoreNew = closed.get( currentKey )[1] + 1;
			if ( !open.has( key ) || gScoreNew < open.get( key )[1] ) {
				let hScore = h( coords , endCoords );
				let fScore = hScore + gScoreNew
				open.set( key , [fScore , gScoreNew , hScore , currentKey] );
			}
		} );
	}
	return [];
}