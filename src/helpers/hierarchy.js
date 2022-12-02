export class Hierarchy {

    constructor() {
        this.eachAfter = (callback, that) => {
            var node = this, nodes = [node], next = [], children, i, n, index = -1;
            while (node = nodes.pop()) {
                next.push(node);
                if (children = node.children) {
                    for (i = 0, n = children.length; i < n; ++i) {
                        nodes.push(children[i]);
                    }
                }
            }
            while (node = next.pop()) {
                callback.call(that, node, ++index, this);
            }
            return this;
        }

        this.eachBefore = (callback, that) => {
            var node = this, nodes = [node], children, i, index = -1;
            while (node = nodes.pop()) {
                callback.call(that, node, ++index, this);
                if (children = node.children) {
                    for (i = children.length - 1; i >= 0; --i) {
                        nodes.push(children[i]);
                    }
                }
            }
            return this;
        }
    }
}