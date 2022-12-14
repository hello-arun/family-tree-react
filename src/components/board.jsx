// This is an SVG element where all the drawing will happen
// based on the JSON Tree Structure
import React, { Component } from "react";
import { ROOT_ID, NUM_GEN, _R } from "../settings";
import {
    generateNodes,
    generateTree,
    getParentId,
} from "../helpers/parseGenome";
import PersonSVG from "./drawingElement";
import { beautifyTree } from "../helpers/tidyTree";
import ExtraInfo from "./extraInfo";

class Board extends Component {
    history = [];
    state = {
        rootId: ROOT_ID,
        maxLevel: NUM_GEN,
        rootNode: this.initNodes(ROOT_ID, NUM_GEN),
        extraInfoNode: null,
    };

    initNodes(rootId, maxLevel, parent = null) {
        let person = generateTree(rootId, maxLevel, parent);
        let rootNode = generateNodes(person, maxLevel);
        beautifyTree(rootNode);
        return rootNode;
    }

    getNodeArray(rootNode, maxLevel) {
        // console.log(rootNode);
        let allNodes = [rootNode];
        let level = 0;
        let toExpand = [rootNode];
        while (level < maxLevel) {
            let toExpandNext = [];
            toExpand.forEach((node) => {
                if (node.isLeaf()) {
                    return;
                }
                node.children.forEach((child) => {
                    allNodes.push(child);
                    toExpandNext.push(child);
                });
            });
            level += 1;
            toExpand = [...toExpandNext];
        }
        toExpand = null;
        // console.log(allNodes);
        return allNodes;
    }

    handlePointerEnter = (node) => {
        const { extraInfoNode } = this.state;
        if (extraInfoNode !== null) extraInfoNode.selected = false;
        node.selected = true;
        this.setState({
            rootNode: this.state.rootNode,
            extraInfoNode: node,
        });
    };

    handlePointerLeave = (node) => {
        const { extraInfoNode } = this.state;
        if (extraInfoNode !== null) extraInfoNode.selected = false;
        this.setState({
            rootNode: this.state.rootNode,
            extraInfoNode: null,
        });
    };

    calcBounds(allNodes) {
        let xmin = allNodes[0].x;
        let ymin = allNodes[0].y;
        let xmax = xmin;
        let ymax = ymin;
        allNodes.forEach((node) => {
            xmin = node.x < xmin ? node.x : xmin;
            xmax = node.x > xmax ? node.x : xmax;

            ymin = node.y < ymin ? node.y : ymin;
            ymax = node.y > ymax ? node.y : ymax;
        });
        return {
            xmin: xmin,
            xmax: xmax,
            ymin: ymin,
            ymax: ymax,
        };
    }

    handleMakeRoot = () => {
        const { extraInfoNode, maxLevel } = this.state;
        if (extraInfoNode === null) return;
        this.history.push({
            rootId: this.state.rootId,
            maxLevel: this.state.maxLevel,
        });

        const rootId = extraInfoNode.person.id;
        this.setState({
            rootId: rootId,
            rootNode: this.initNodes(rootId, maxLevel),
            extraInfoNode: null,
        });
    };

    handleParent = (parentIdentifier) => {
        const { extraInfoNode } = this.state;
        if (extraInfoNode === null) return;
        const parentId = getParentId(extraInfoNode.person.id, parentIdentifier);
        if (parentId === null) return;

        this.history.push({
            rootId: this.state.rootId,
            maxLevel: this.state.maxLevel,
        });

        const rootNode = this.initNodes(parentId, this.state.maxLevel);
        this.setState({
            rootId: parentId,
            rootNode: rootNode,
            extraInfoNode: null,
        });
        // const rootId = extraInfoNode.person.id
        // const maxLevel = this.state.maxLevel
    };

    handlePlusMinus = (increment) => {
        const { rootId, maxLevel } = this.state;
        if (increment < 0 && maxLevel < 1) return;
        if (increment > 0 && maxLevel > 12) return;
        this.history.push({
            rootId: this.state.rootId,
            maxLevel: this.state.maxLevel,
        });
        this.setState({
            maxLevel: maxLevel + increment,
            rootNode: this.initNodes(rootId, maxLevel + increment),
        });
    };

    handleUndo = () => {
        if (!this.history.length) return;
        const { rootId, maxLevel } = this.history.pop();
        this.setState({
            rootId: rootId,
            maxLevel: maxLevel,
            rootNode: this.initNodes(rootId, maxLevel),
            extraInfoNode: null,
        });
    };

    render() {
        const allNodes = this.getNodeArray(
            this.state.rootNode,
            this.state.maxLevel
        );
        const { xmin, xmax, ymin, ymax } = this.calcBounds(allNodes);
        const margin = 50;
        let circles = new Array(this.state.maxLevel + 1);
        for (let i = 0; i < this.state.maxLevel; i++) {
            circles[i] = i;
        }
        return (
            <React.Fragment>
                <div
                    className="grid-item-tree"
                    onPointerUp={() => {
                        this.handlePointerLeave();
                    }}
                >
                    <svg
                        className="svg-tree"
                        id="main-board"
                        viewBox={`${xmin - margin}  ${ymin - margin} ${
                            xmax - xmin + margin * 2
                        } ${ymax - ymin + margin * 2}`}
                    >
                        <g>
                            {circles.map((c) => (
                                <circle
                                    className="cncentric-circle"
                                    cx="0"
                                    cy="0"
                                    r={(1 + c) * _R}
                                    key={c}
                                ></circle>
                                // <text>khkhjkhkjkh</text>
                                // <circle cx="0" cy="0" r={c * _R} key={"jhg"+c}></circle>
                            ))}
                        </g>
                        {allNodes.map((node) => (
                            <PersonSVG
                                key={node.person.id}
                                node={node}
                                onPointerEnter={this.handlePointerEnter}
                                onPointerLeave={this.handlePointerLeave}
                            />
                        ))}
                    </svg>
                </div>
                <div className="grid-item-info">
                    <ExtraInfo node={this.state.extraInfoNode}></ExtraInfo>
                </div>
                <div className="grid-item-info">
                    <div className="controls">
                        {"Set Root "}
                        <button onClick={this.handleMakeRoot}>Self</button>{" "}
                        <button onClick={() => this.handleParent("father")}>
                            Father
                        </button>{" "}
                        <button onClick={() => this.handleParent("mother")}>
                            Mother
                        </button>{" "}
                    </div>
                    <button onClick={this.handleUndo}>Undo</button>{" "}
                    <button onClick={() => this.handlePlusMinus(-1)}>-</button>
                    {" " + (this.state.maxLevel + 1) + " "}
                    <button onClick={() => this.handlePlusMinus(1)}>
                        +
                    </button>{" "}
                </div>
            </React.Fragment>
        );
    }
}

export default Board;
