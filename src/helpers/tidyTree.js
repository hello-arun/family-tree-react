import { Node } from "./node.js";
import { SIBLINGSEP, COUSINSEP, _R, _ST } from "../settings.js";
function separation(a, b) {
    return (a.parent === b.parent ? SIBLINGSEP : COUSINSEP) / a.level;
}

function nextLeft(v) {
    var children = v.children;
    return children ? children[0] : v.t;
}

// This function works analogously to nextLeft.
function nextRight(v) {
    var children = v.children;
    return children ? children[children.length - 1] : v.t;
}

// Shifts the current subtree rooted at w+. This is done by increasing
// prelim(w+) and mod(w+) by shift.
function moveSubtree(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
}

// All other shifts, applied to the smaller subtrees between w- and w+, are
// performed by this function. To prepare the shifts, we have to adjust
// change(w+), shift(w+), and change(w-).
function executeShifts(v) {
    var shift = 0,
        change = 0,
        children = v.children,
        i = children.length,
        w;
    while (--i >= 0) {
        w = children[i];
        w.z += shift;
        w.m += shift;
        shift += w.s + (change += w.c);
    }
}

// If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
// returns the specified (default) ancestor.
function nextAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
}



/**
 * Initilize modifiers, threads and ancestors
 * And then implements first and second walk
 * @param {Node} root
 */
export function beautifyTree(root) {
    initTree(root);
    root.eachAfter(firstWalk)
    root.parent.m = -root.z
    root.eachBefore(secondWalk)

    // const maxSpread = calMinSep(root)
    // const threshold = Math.PI*2
    // if (maxSpread > threshold){
    //     const tfact = threshold/maxSpread
    // }
    // root.eachAfter(normalizeSpread,0.5)
    root.eachBefore(toRadial)
    // firstWalk(root);
    // secondWalk(root, -root.z);
}

// function calMinSep(root) {
//     let nodes = [root], children, i;
//     let nextNodes = []
//     let maxSpread = 0;
//     while (nodes.length) {
//         nodes.forEach(node => {
//             nextNodes = node.children ? [...nextNodes, ...node.children] : nextNodes
//         });
//         let spread = -nodes[0].x + nodes.at(-1).x
//         console.log(nodes, spread)
//         maxSpread = spread > maxSpread ? spread : maxSpread;
//         nodes = [...nextNodes]
//         nextNodes = []
//         // // calMinSep(that, node, ++index, this);
//         // if (children = node.children) {
//         //     for (i = children.length - 1; i >= 0; --i) {
//         //         nodes.push(children[i]);
//         //     }
//         // }
//     }
//     return maxSpread;

// }

function toRadial(v) {
    const x = v.x * _ST
    // v.th = v.x
    v.x = _R * v.level * Math.cos(x + Math.PI / 4)
    v.y = _R * v.level * Math.sin(x + Math.PI / 4)
}

// To to keep the plot spread in the given theta range
// function normalizeSpread(v, tFact) {
//     v.x = v.x * tFact;
// }

/**
 *
 * @param {Node} root
 */
function initTree(root) {
    let temp = new Node(null, 0)
    temp.children = [root]
    root.parent = temp;
    // root.parent = (new Node(null, 0)).children = [root];
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
function initNumber(v, number = 0) {
    v.i = number;
    if (v.isLeaf()) {
        return;
    }
    for (let i = 0; i < v.children.length; i++) {
        const w = v.children[i];
        initNumber(w, i);
    }
}

// Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
// applied recursively to the children of v, as well as the function
// APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
// node v is placed to the midpoint of its outermost children.
function firstWalk(v) {
    var children = v.children,
        siblings = v.parent.children,
        w = v.i ? siblings[v.i - 1] : null;
    if (children) {
        executeShifts(v);
        var midpoint =
            (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
            v.z = w.z + separation(v, w);
            v.m = v.z - midpoint;
        } else {
            v.z = midpoint;
        }
    } else if (w) {
        v.z = w.z + separation(v, w);
    }
    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
}

// Computes all real x-coordinates by summing up the modifiers recursively.
function secondWalk(v) {
    v.x = v.z + v.parent.m;
    v.m += v.parent.m;
}

// The core of the algorithm. Here, a new subtree is combined with the
// previous subtrees. Threads are used to traverse the inside and outside
// contours of the left and right subtree up to the highest common level. The
// vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
// superscript o means outside and i means inside, the subscript - means left
// subtree and + means right subtree. For summing up the modifiers along the
// contour, we use respective variables si+, si-, so-, and so+. Whenever two
// nodes of the inside contours conflict, we compute the left one of the
// greatest uncommon ancestors using the function ANCESTOR and call MOVE
// SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
// Finally, we add a new thread (if necessary).
function apportion(v, w, ancestor) {
    if (w) {
        var vip = v,
            vop = v,
            vim = w,
            vom = vip.parent.children[0],
            sip = vip.m,
            sop = vop.m,
            sim = vim.m,
            som = vom.m,
            shift;
        while (
            ((vim = nextRight(vim)), (vip = nextLeft(vip)), vim && vip)
        ) {
            vom = nextLeft(vom);
            vop = nextRight(vop);
            vop.a = v;
            shift = vim.z + sim - vip.z - sip + separation(vim, vip);
            if (shift > 0) {
                moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
                sip += shift;
                sop += shift;
            }
            sim += vim.m;
            sip += vip.m;
            som += vom.m;
            sop += vop.m;
        }
        if (vim && !nextRight(vop)) {
            vop.t = vim;
            vop.m += sim - sop;
        }
        if (vip && !nextLeft(vom)) {
            vom.t = vip;
            vom.m += sip - som;
            ancestor = v;
        }
    }
    return ancestor;
}
