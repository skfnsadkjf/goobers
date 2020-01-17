console.log('hello')

let hero = {'pos': [0,0]}

let map_dimensions = 10
let grid = Array.from({length: map_dimensions}, () => {
    return Array.from({length: map_dimensions}, () =>
        Math.random() > 0.2 ? '.' : '#'
    )
})

function print_map(map, entities) {
    map.forEach((row, y) => {
        let s = ''
        row.forEach((v, x) => {
            drawhero = entities.some(v => {
                return v.pos[0] == x && v.pos[1] == y
            })
            s += drawhero ? '%' : v
        })
        console.log(s)
    })
}

document.addEventListener('keydown', (e) => {
    console.log('keydown')
    console.log(e)
    if ( e.key == "f" && hero.pos[0] < map_dimensions - 1 ) {
        hero.pos[0]++;
    }
    console.log( hero.pos );
    if ( e.key == "s" && hero.pos[0] > 0 ) {
        hero.pos[0]--;
    }
    if ( e.key == "d" && hero.pos[1] < map_dimensions - 1 ) {
        hero.pos[1]++;
    }
    if ( e.key == "e" && hero.pos[1] > 0 ) {
        hero.pos[1]--;
    }
    print_map( grid , [hero] );
})


print_map(grid, [hero])
