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
        let s = row
        entities.forEach(e => {
            if (e.pos[1] == y) {
                s[e.pos[0]] = '%'
            }
        })
        console.log(s.join(''))
        // row.forEach(v => {
        //     console.log(v)
        // })
    })
}



print_map(grid, [hero])
