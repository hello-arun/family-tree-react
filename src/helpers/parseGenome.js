import { genomeData } from "../data/genome";
import { Person } from "./person.js";
import { Node } from "./node.js";
/**
 * 
 * @param {String} rootId 
 * @param {Number} maxLevel 
 * @returns 
 */
const genomeMap = new Map();
genomeData.forEach(entry => {
    genomeMap.set(entry.id, entry)
});

export function getParentId(memberId, parentIdentifier = "father") {
    let memberData = genomeMap.get(memberId)
    console.log(memberData)
    if (parentIdentifier === 'father' && memberData.fatherId) {
        return memberData.fatherId;
    } else if (parentIdentifier == 'mother' && memberData.motherId) {
        return memberData.motherId;
    }
    return null
}

export function generateTree(rootId, maxDepth = 0) {
    let rootData = genomeMap.get(rootId)
    const root = new Person(rootId, rootData.name, rootData.sex)
    let currDepth = 0
    let toExpand = [root]
    while (currDepth < maxDepth) {
        let numPersonCurrDepth = toExpand.length
        while (--numPersonCurrDepth >= 0) {
            let person = toExpand.shift()
            const personData = genomeMap.get(person.id)
            const { relationships } = personData
            relationships && relationships.forEach(relation => {
                const { partnerId, childrenIds } = relation
                const { name, sex } = genomeMap.get(partnerId)
                const partener = new Person(partnerId, name, sex)
                let children = childrenIds.map(cid => {
                    const { name, sex, description } = genomeMap.get(cid)
                    return new Person(cid, name, sex, description)
                })
                person.addRelationship(partener, children)
                toExpand = [...toExpand, ...children]
            });
        }
        currDepth += 1
    }
    return root
}


/**
 * 
 * @param {Person} person 
 * @param {Number} maxDepth 
 */
export function generateNodes(person, maxDepth = 0) {
    const root = new Node(person)
    let currDepth = 0
    let toExpand = [root]
    while (currDepth < maxDepth) {
        let numPersonCurrDepth = toExpand.length
        while (--numPersonCurrDepth >= 0) {
            let node = toExpand.shift()
            let allChildren = []
            const relationships = node.person.relationships
            relationships && relationships.forEach(relation => {
                const { children } = relation
                children.forEach(child => {
                    allChildren.push(new Node(child))
                });
            });
            toExpand = [...toExpand, ...allChildren]
            node.setChildren(allChildren)
        }
        currDepth += 1
    }
    return root
}