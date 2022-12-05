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
// console.log(genomeData)
genomeData.forEach(entry => {
    genomeMap.set(entry.id, entry)
});

export function getParentId(memberId, parentIdentifier = "father") {
    // if (memberId === null) return null
    let memberData = genomeMap.get(memberId)
    if (parentIdentifier === 'father' && memberData.father) {
        return memberData.father;
    } else if (parentIdentifier == 'mother' && memberData.mother) {
        return memberData.mother;
    }
    return null
}

export function generateTree(rootId, maxLevel = 0) {

    let rootData = genomeMap.get(rootId)
    const root = new Person(rootId, rootData.name, rootData.sex)
    let level = 0
    let toExpand = [root]
    while (level < maxLevel) {
        let toExpandNext = []
        toExpand.forEach(person => {
            const personData = genomeMap.get(person.id)
            if (!personData.relationships) {
                return;
            }
            personData.relationships.forEach(relation => {
                const { partnerId: pid, children: childrenIds } = relation
                const { name, sex } = genomeMap.get(pid)
                const partener = new Person(pid, name, sex)
                let children = []
                childrenIds.forEach(cid => {
                    const { name, sex, description } = genomeMap.get(cid)
                    let child = new Person(cid, name, sex, description)
                    children.push(child)
                });
                person.addRelationship(partener, children)
                toExpandNext = [...toExpandNext, ...children]
            });
        });
        level += 1
        toExpand = [...toExpandNext]
    }
    return root
}


/**
 * 
 * @param {Person} person 
 * @param {Number} maxLevel 
 */
export function generateNodes(person, maxLevel = 0) {
    const root = new Node(person)
    let level = 0
    let toExpand = [root]
    while (level < maxLevel) {
        let toExpandNext = []
        toExpand.forEach(node => {
            let allChildren = []
            if (!node.person.relationships) {
                return;
            }
            node.person.relationships.forEach(relation => {
                const { children } = relation
                children.forEach(child => {
                    allChildren.push(new Node(child))
                });
                toExpandNext = [...toExpandNext, ...allChildren]
                node.setChildren(allChildren)
            });

        });
        level += 1
        toExpand = [...toExpandNext]
    }
    return root
}