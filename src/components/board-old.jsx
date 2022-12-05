// This is an SVG element where all the drawing will happen
// based on the JSON Tree Structure
import React, { useState } from "react";
import { _rootID, _maxDepth, _R } from "../settings";
import {
    generateNodes,
    generateTree,
    getParentId,
} from "../helpers/parseGenome";
import PersonSVG from "./drawingElement";
import { beautifyTree } from "../helpers/tidyTree";
import ExtraInfo from "./extraInfo";

function Board(){


   const initNodes = (rootId, maxDepth, parent = null) => {
        let person = generateTree(rootId, maxDepth, parent);
        let rootNode = generateNodes(person, maxDepth);
        beautifyTree(rootNode);
        return rootNode;
    }

    const allNodes = () => {
        let allNodes = [rootNode];
        let level = 0;
        let toExpand = [rootNode];
        while (level < maxDepth) {
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
        return allNodes;
    }

    handlePointerEnter = (node) => {
        const { extraInfoNode } = state;
        if (extraInfoNode !== null) extraInfoNode.selected = false;
        node.selected = true;
        setState({
            rootNode: state.rootNode,
            extraInfoNode: node,
        });
    };

    handlePointerLeave = (node) => {
        const { extraInfoNode } = state;
        if (extraInfoNode !== null) extraInfoNode.selected = false;
        setState({
            rootNode: state.rootNode,
            extraInfoNode: null,
        });
    };

    const calcBounds = () => {
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
        const { extraInfoNode, maxLevel } = state;
        if (extraInfoNode === null) return;
        history.push({
            rootId: state.rootId,
            maxLevel: state.maxLevel,
        });

        const rootId = extraInfoNode.person.id;
        setState({
            rootId: rootId,
            rootNode: initNodes(rootId, maxLevel),
            extraInfoNode: null,
        });
    };

    handleParent = (parentIdentifier) => {
        const { extraInfoNode } = state;
        if (extraInfoNode === null) return;
        const parentId = getParentId(extraInfoNode.person.id, parentIdentifier);
        if (parentId === null) return;

        history.push({
            rootId: state.rootId,
            maxLevel: state.maxLevel,
        });

        const rootNode = initNodes(parentId, state.maxLevel);
        setState({
            rootId: parentId,
            rootNode: rootNode,
            extraInfoNode: null,
        });
    };

    handlePlusMinus = (increment) => {
        const { rootId, maxLevel } = state;
        if (increment < 0 && maxLevel < 1) return;
        if (increment > 0 && maxLevel > 12) return;
        history.push({
            rootId: state.rootId,
            maxLevel: state.maxLevel,
        });
        setState({
            maxLevel: maxLevel + increment,
            rootNode: initNodes(rootId, maxLevel + increment),
        });
    };

    handleUndo = () => {
        if (!history.length) return;
        const { rootId, maxLevel } = history.pop();
        setState({
            rootId: rootId,
            maxLevel: maxLevel,
            rootNode: initNodes(rootId, maxLevel),
            extraInfoNode: null,
        });
    };

    return (

        return (
            <React.Fragment>
                <div
                    className="grid-item-tree"
                    onPointerUp={() => {
                        handlePointerLeave();
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
                            ))}
                        </g>
                        {allNodes.map((node) => (
                            <PersonSVG
                                key={node.person.id}
                                node={node}
                                onPointerEnter={handlePointerEnter}
                                onPointerLeave={handlePointerLeave}
                            />
                        ))}
                    </svg>
                </div>
                
            </React.Fragment>
        );
    )
}

export default Board;
