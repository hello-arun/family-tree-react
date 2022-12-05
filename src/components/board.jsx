import React, { useEffect, useState } from "react";
import { _rootID, _maxDepth} from "../settings";
import {
    generateNodes,
    generateTree,
    getParentId,
} from "../helpers/parseGenome";
import { beautifyTree } from "../helpers/tidyTree";
import ExtraInfo from "./extraInfo";
import SvgContainer from "./svgContainer";

function board() {
    function initNodes(rootId, maxDepth) {
        let person = generateTree(rootId, maxDepth, parent);
        let rootNode = generateNodes(person, maxDepth);
        beautifyTree(rootNode);
        return rootNode;
    }

    const [history] = useState([]);
    const [rootId, setRootId] = useState(_rootID);
    const [maxDepth, setMaxDepth] = useState(_maxDepth);
    const [rootNode, setRootNode] = useState(initNodes(_rootID, _maxDepth));
    const [selectedNode, setSelectedNode] = useState(null);

    const resetSelection = () => {
        setSelectedNode((currVal) => {
            currVal && (currVal.selected = false);
            return null;
        });
    };

    useEffect(() => {
        setRootNode(initNodes(rootId, maxDepth));
    }, [rootId, maxDepth]);

    const handleUndo = () => {
        console.log(history);
        if (history.length <= 0) return;
        const { rootId: rt_, maxDepth: md_ } = history.pop();
        setRootId(rt_);
        setMaxDepth(md_);
    };

    const handleParent = (parentIdentifier) => {
        if (selectedNode === null) return;
        const parentId = getParentId(selectedNode.person.id, parentIdentifier);
        resetSelection();
        history.push({
            rootId: rootId,
            maxDepth: maxDepth,
        });
        parentId && setRootId(parentId);
    };
    return (
        <React.Fragment>
            <div
                className="grid-item-tree"
                onPointerUp={() => resetSelection()}
            >
                <SvgContainer
                    numGeneration={maxDepth}
                    rootNode={rootNode}
                    selectedNode={selectedNode}
                    onPointerDown={(node) =>
                        setSelectedNode((currVal) => {
                            currVal && (currVal.selected = false);
                            node.selected = true;
                            return node;
                        })}
                ></SvgContainer>
            </div>
            <div className="grid-item-info">
                <ExtraInfo node={selectedNode}></ExtraInfo>
            </div>
            <div className="grid-item-info">
                <div className="controls">
                    {"Set Root "}
                    <button
                        onClick={() => {
                            selectedNode && setRootId(selectedNode.person.id);
                        }}
                    >
                        Self
                    </button>{" "}
                    <button onClick={() => handleParent("father")}>
                        Father
                    </button>{" "}
                    <button onClick={() => handleParent("mother")}>
                        Mother
                    </button>{" "}
                </div>
                <button onClick={handleUndo}>Undo</button>{" "}
                <button
                    onClick={() =>
                        setMaxDepth((curr) => (curr > 0 ? curr - 1 : curr))
                    }
                >
                    -
                </button>
                {" " + (maxDepth + 1) + " "}
                <button
                    onClick={() =>
                        setMaxDepth((curr) => (curr < 12 ? curr + 1 : curr))
                    }
                >
                    +
                </button>{" "}
            </div>
        </React.Fragment>
    );
}

export default board;
