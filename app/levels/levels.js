const brick = (row, column, color, weapon = null) => {
    return {
        color: color,
        cracked: false,
        weapon: weapon,
        column: column,
        row: row
    }
}

const colors1 = [
    "#E8a005",
    "#EC7505",
    "#D84A05",
    "#F42B03",
    "#E70E02"
]


const level1 = [
    brick(4, 4, colors1[0]),
    brick(4, 3, colors1[1]),
    brick(4, 1, colors1[2]),
    brick(5, 3, colors1[3]),
    brick(5, 4, colors1[4]),
    brick(5, 5, colors1[1]),
    brick(5, 6, colors1[2]),
    brick(1, 3, colors1[3]),
    brick(1, 2, colors1[4]),
    brick(7, 6, colors1[0]),
    brick(10, 2, colors1[0]),

];

const Levels = [level1]

export default Levels
