console.log('hello')

let map_dimensions = 10
let grid = Array.from({length: map_dimensions}, () => {
    return Array.from({length: map_dimensions}, () =>
        Math.random() > 0.2 ? ' ' : '#'
    )
})

function print_map(map) {
    map.forEach(row => {
        console.log(row.toString())
        // row.forEach(v => {
        //     console.log(v)
        // })
    })
}

print_map(grid)
