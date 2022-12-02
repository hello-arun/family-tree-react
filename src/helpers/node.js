import { Hierarchy } from "./hierarchy";

/**
 * An Abstract Node class for handeling tidyTree drawing algorithm
 */
export class Node extends Hierarchy {
    constructor(person) {
        super()
        this.person = person // To bind data to this node
        this.children = null;
        this.parent = null;
        this.x = 0;
        this.y = 0;
        this.level = 0;
        this.A = null; //default ancestor
        this.z = 0; // Prelim x cord
        this.m = 0; // Modifer
        this.t = null;
        this.a = this;
        this.i = -1;

        this.c = 0
        this.s = 0

        // this.r = 0;
        // this.th = 0;

        this.isLeaf = () => {
            return this.children === null || this.children.length === 0;
        };

        this.getFirstChild = () => {
            // console.log(this)
            if (this.children) return this.children[0];
            else return null;
        };

        this.getLeftSibling = () => {
            if (this.parent === null) return null;
            const index = this.parent.children.indexOf(this);
            if (index === 0) return null;
            else return this.parent.children[index - 1];
        };

        this.getLeftMostSibling = () => {
            if (this.parent === null) return null;
            const index = this.parent.children.indexOf(this);
            if (index === 0) return null;
            else return this.parent.children[0];
        };

        this.getRightMostSibling = () => {
            if (this.parent === null) return null;
            const index = this.parent.children.indexOf(this);
            if (index === this.parent.children.length - 1) return null;
            else return this.parent.children.at(-1);
        };

        this.getRightSibling = () => {
            if (this.parent === null) return null;
            const index = this.parent.children.indexOf(this);
            if (index === this.parent.children.length - 1) return null;
            else return this.parent.children[index + 1];
        };

        this.getLeftNbr = () => {
            if (this.parent === null) return null;
            const parentleftSibling = this.parent.getLeftSibling();
            if (
                parentleftSibling === null ||
                parentleftSibling.children === null
            )
                return null;
            return parentleftSibling.children.at(-1);
        };

        this.getRightNbr = () => {
            if (this.parent === null) return null;
            const parentleftSibling = this.parent.getLeftSibling();
            if (
                parentleftSibling === null ||
                parentleftSibling.children === null
            )
                return null;
            return parentleftSibling.children[0];
        };

        /**
         * This method bind the given children with the parent node.
         * This is like two way data binding.
         * @param {Node []} children 
         */
        this.setChildren = (children) => {
            if (children.length === 0) return
            this.children = children
            children.forEach(child => {
                child.parent = this
            });
        }
    }
}

// Node.prototype.eachAfter = eachAfter
// Node.prototype.eachBefore = eachBefore



