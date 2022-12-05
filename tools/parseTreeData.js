const inFile = './tree-latest.json'
const outFile = inFile.replace(".json", "") + "-formatted.json"

const data = require(inFile);
const fs = require("fs");
const { inflate } = require("zlib");
tree = data.tree

const treeMap = new Map()


tree.forEach(person => {
    delete person.x
    delete person.y
    delete person.surname
    delete person.isNode

})

tree.forEach(person => {
    treeMap.set(person.id, person)
});

tree.forEach(person => {
    if (!person.relationships) return
    person.relationships.forEach(relationship => {
        delete relationship.direction
        const partnerId = relationship.partnerId
        if (!relationship.children || !relationship.children.length) return
        let children = relationship.children
        children.forEach(childId => {
            child = treeMap.get(childId)
            child.father = person.sex === "m" ? person.id : partnerId
            child.mother = person.sex === "f" ? person.id : partnerId
        })
    })
})
const finalData = { genomeData: tree }
console.log(treeMap);
fs.writeFile(outFile, JSON.stringify(finalData), 'utf8', () => {
    console.log("Written Succesfully")
});