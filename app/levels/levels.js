const brick = (color = false, weapon = null) => {
    let exists = true;
    if(color == false){
        exists = false;
    }
    return {
        color: color,
        cracked: false,
        exists: exists,
        weapon: weapon
    }
}

const colors = [
    "#E89005",
    "#EC7505",
    "#D84A05",
    "#F42B03",
    "#E70E02"
]

const blankRow = () => {
    let array = [];
    for(let i = 0; i < 7; i++){
        array.push(brick())
    }
    return array;
}

const level1 = [
    [brick(), brick(colors[3]), brick(colors[4]), brick(), brick(colors[4]), brick(colors[3]), brick()],
    [brick(colors[3]), brick(colors[4]), brick(), brick(colors[4]), brick(), brick(colors[4]), brick(colors[3])],
    [brick(colors[1]), brick(), brick(), brick(colors[3]), brick(), brick(), brick(colors[1])],
    [brick(colors[0]), brick(colors[1]), brick(), brick(colors[1]), brick(), brick(colors[1]), brick(colors[0])],
    [brick(), brick(colors[0]), brick(colors[1]), brick(), brick(colors[1]), brick(colors[0]), brick()],
    blankRow(),
    [brick(), brick(colors[0]), brick(colors[1]), brick(), brick(colors[1]), brick(colors[0]), brick()],
    [brick(colors[0]), brick(colors[1]), brick(), brick(colors[2]), brick(), brick(colors[1]), brick(colors[0])],
    [brick(colors[1]), brick(), brick(), brick(colors[1]), brick(), brick(), brick(colors[1])],
    [brick(colors[0]), brick(colors[1]), brick(), brick(colors[0]), brick(), brick(colors[1]), brick(colors[0])],
    [brick(), brick(colors[0]), brick(colors[1]), brick(), brick(colors[1]), brick(colors[0]), brick()],
    blankRow()
];

const Levels = [level1]

export default Levels
