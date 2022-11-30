import { Node } from "./node";

/**
 * If two nodes are not sibling separate them slightly more
 * Devided by level of a to make consistant distace in radial tree
 * @param {Node} a
 * @param {Node} b
 */
function DISTANCE(a, b) {
    return (a.parent === b.parent ? 1 : 1.1) / a.level;
}

/**
 * Initilize modifiers, threads and ancestors
 * And then implements first and second walk
 * @param {Node} root
 */
export function beautifyTree(root) {
    initTree(root);
    // console.log(root);
    // We already Initilized modifiers in Node class
    firstWalk(root);
    secondWalk(root, -root.prelim);
    // console.log("After Executing", root)
    // drawTree(root);
}

/**
 *
 * @param {Node} root
 */
function initTree(root) {
    initLevel(root);
    initNumber(root);
}

function initLevel(v, level = 0) {
    v.level = level;
    if (v.isLeaf()) return;
    else
        for (let i = 0; i < v.children.length; i++) {
            const w = v.children[i];
            initLevel(w, level + 1);
        }
}

/**
 *
 * @param {Node} v
 */
function initNumber(v, number = 1) {
    v.number = v.parent === null ? 1 : number;
    if (v.isLeaf()) {
        return;
    }
    for (let i = 0; i < v.children.length; i++) {
        const w = v.children[i];
        initNumber(w, i + 1);
    }
}

/**
 * Computes a prelimnary x-cords for each node
 * But this is applied to the children of v first
 * @param {Node} v
 */
function firstWalk(v) {
    if (v.isLeaf()) {
        v.prelim = 0;
        let w = v.getLeftSibling();
        if (w !== null) {
            v.prelim = w.prelim + DISTANCE(v, w);
        }
    } else {
        let defaultAncestor = v.children[0];
        for (let i = 0; i < v.children.length; i++) {
            let w = v.children[i];
            firstWalk(w);
            Apportion(w, defaultAncestor);
        }

        executeShifts(v);
        // console.log(v)
        let midpoint = 0.5 * (v.children[0].prelim + v.children.at(-1).prelim);
        let w = v.getLeftSibling();
        if (w !== null) {
            v.prelim = w.prelim + DISTANCE(v, w);
            v.mod = v.prelim - midpoint;
        } else {
            v.prelim = midpoint;
        }
    }
}

/**
 *
 * @param {Node} v
 * @param {Node} defaultAncestor
 */
function Apportion(v, defaultAncestor) {
    let w = v.getLeftSibling();
    if (w !== null) {
        let vIR = v;
        let vOR = v;
        let vIL = w;
        let vOL = vIR.getLeftMostSibling();

        let sIR = vIR.mod;
        let sOR = vOR.mod;
        let sIL = vIL.mod;
        let sOL = vOL.mod;
        while (nextRight(vIL) !== null && nextLeft(vIR) !== null) {
            vIL = nextRight(vIL);
            vIR = nextLeft(vIR);
            vOL = nextLeft(vOL);
            vOR = nextRight(vOR);
            // console.log(vOR)
            vOR.ancestor = v;
            let shift =
                vIL.prelim + sIL - (vIR.prelim + sIR) + DISTANCE(vIL, vIR);
            if (shift > 0) {
                moveSubtree(ANCESTOR(vIL, v, defaultAncestor), v, shift);
                sIR += shift;
                sOR += shift;
            }
            sIL += vIL.mod;
            sIR += vIR.mod;
            sOL += vOL.mod;
            sOR += vOR.mod;
        }

        if (nextRight(vIL) !== null && nextRight(vOR) === null) {
            vOR.thread = nextRight(vIL);
            vOR.mod += sIL - sOR;
        }

        if (nextLeft(vIR) !== null && nextLeft(vOL) === null) {
            vOL.thread = nextLeft(vIR);
            vOL.mod += sIR - sOL;
            defaultAncestor = v;
        }
    }
}
/**
 * This method returns next member in the left counter
 * @param {Node} v
 */
function nextLeft(v) {
    if (!v.isLeaf()) {
        return v.children[0];
    } else {
        return v.thread;
    }
}
/**
 * This method returns next member in the Right counter
 * @param {Node} v
 */
function nextRight(v) {
    if (!v.isLeaf()) {
        return v.children.at(-1);
    } else {
        return v.thread;
    }
}

/**
 *
 * @param {Node} wL
 * @param {Node} wR
 * @param {Number} shift
 */
function moveSubtree(wL, wR, shift) {
    let subTress = wR.number - wL.number;
    // console.log(wR.name, wL.name, "subTress", subTress);
    wR.change -= shift / subTress;
    wR.shift += shift;
    wL.change += shift / subTress;
    wR.prelim += shift;
    wR.mod += shift;
}

/**
 *
 * @param {Node} v
 */
function executeShifts(v) {
    let shift = 0;
    let change = 0;
    for (let i = v.children.length - 1; i >= 0; i--) {
        const w = v.children[i];
        w.prelim += shift;
        w.mod += shift;
        change += w.change;
        shift += w.shift + change;
    }
}

/**
 *
 * @param {Node} vIL
 * @param {Node} v
 * @param {Node} defaultAncestor
 */
function ANCESTOR(vIL, v, defaultAncestor) {
    if (isSibling(vIL.ancestor, v)) return vIL.ancestor;
    else return defaultAncestor;
}

function isSibling(v, w) {
    if (v.parent === null || w.parent === null) {
        return false;
    } else {
        return v.parent === w.parent;
    }
}

function secondWalk(v, m) {

    const rFact = 110;
    const tFact = 0.51;
    const dt = Math.PI/2;
    const r = rFact * v.level;
    const th = (v.prelim + m+dt)*tFact
    v.x = r * Math.cos(th);
    v.y = r * Math.sin(th);


    if (v.isLeaf()) return;

    for (let i = 0; i < v.children.length; i++) {
        const w = v.children[i];
        secondWalk(w, m + v.mod);
    }
}
