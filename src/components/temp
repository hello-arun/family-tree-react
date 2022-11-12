const tree = document.querySelector("#tree")
var bBox = tree.getBBox();

const x = bBox.x + bBox.width / 2
const y = bBox.y + bBox.height * 0.80
let rl = 10
let rh = 55
const th = Math.PI  //theta
const phi = 0 //phi

const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
const p1 = [x + rl * Math.cos(phi), y - rl * Math.sin(phi)]
const p2 = [x + rl * Math.cos(phi + th), y - rl * Math.sin(phi + th)]
const p3 = [x + rh * Math.cos(phi + th), y - rh * Math.sin(phi + th)]
const p4 = [x + rh * Math.cos(phi), y - rh * Math.sin(phi)]
path.setAttribute("d", `M${p1[0]},${p1[1]}  A${rl},${rl} 0 0,0 ${p2[0]},${p2[1]}, L${p3[0]} ${p3[1]} A${rh} ${rh} 0,0,1, ${p4[0]} ${p4[1]}z`)
path.setAttribute("fill", "red")
path.setAttribute("stroke-width", "1")
path.setAttribute("stroke", "blue")
path.setAttribute("cursor", "pointer")
/* <path
                id="abc"
                d="M150,200  a150,150 0 1,0 150,-150 v20 a130,130 0 1 1 -130 130z"
                fill="red"
                stroke="blue"
                stroke-width="5"
                cursor="pointer"
            /> */
tree.append(path)

console.log('XxY', bBox.x + 'x' + bBox.y);
console.log('size', bBox.width + 'x' + bBox.height);
console.log()


class Person {
    constructor(id, name, gender, father = null, mother = null, parteners = null, children = null) {
        this.id = id
        this.name = name
        this.gender = gender
        this.father = father
        this.mother = mother
        this.parteners = parteners
        this.children = children
    }
}

fetch('./genome/tree.json')
    .then((response) => response.json())
    .then((json) => {

        list = json.tree[0].relationships[0].children
        list.forEach(id => {
            json.tree.forEach(person => {
                if (person.id === id)
                    console.log(person.name)
            })
        });
    });