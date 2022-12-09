import React, { useState } from "react";
import { calcBounds, getParentId } from "../helpers/parseGenome";
import PersonSVG from "./drawingElement";
import ExtraInfo from "./extraInfo";
import GenerationCircles from "./generationCircles";

function SvgContainer(props) {
    const { maxDepth, rootNode, setRootId, setMaxDepth } = props;
    const allNodes = rootNode.expandToArray();
    const treeBounds = calcBounds(allNodes);
    let { xmin, xmax, ymin, ymax } = treeBounds;
    const margin = 50;
    const [selectedNode, setSelectedNode] = useState(null);
    const [history, setHistory] = useState([]);

    const resetSelection = () => {
        setSelectedNode((currVal) => {
            currVal && (currVal.selected = false);
            return null;
        });
    };

    const setRootTo = (parentIdentifier) => {
        if (selectedNode === null) return;
        const parentId = getParentId(selectedNode.person.id, parentIdentifier);
        resetSelection();
        setHistory((prevHistory) => [
            ...prevHistory,
            { rootId: rootNode.person.id, maxDepth: maxDepth },
        ]);
        parentId && setRootId(parentId);
    };

    const handleUndo = () => {
        console.log(history);
        if (history.length <= 0) return;
        const { rootId: rt_, maxDepth: md_ } = history.pop();
        setRootId(rt_);
        setMaxDepth(md_);
    };

    return (
        <React.Fragment>
            <div className="grid-item" onPointerUp={() => resetSelection()}>
                <svg
                    className="svg-tree"
                    id="main-board"
                    viewBox={`${xmin - margin}  ${ymin - margin} ${
                        xmax - xmin + margin * 2
                    } ${ymax - ymin + margin * 2}`}
                >
                    <g>
                        <GenerationCircles
                            numGeneration={maxDepth}
                        ></GenerationCircles>
                    </g>
                    {allNodes.map((node) => (
                        <PersonSVG
                            key={node.person.id}
                            node={node}
                            onPointerDown={(node) =>
                                setSelectedNode((currVal) => {
                                    if (node === currVal) return node;
                                    console.log(
                                        "Changing Selected Node",
                                        currVal
                                    );
                                    currVal && (currVal.selected = false);
                                    node.selected = true;
                                    return node;
                                })
                            }
                        />
                    ))}
                </svg>
            </div>
            <div className="grid-item centered-text medium-font">
                <ExtraInfo node={selectedNode}></ExtraInfo>
            </div>
            <div className="grid-item centered-text">
                <div className="controls">
                    {"Set Root "}
                    <button
                        onClick={() => {
                            selectedNode && setRootId(selectedNode.person.id);
                        }}
                    >
                        Self
                    </button>{" "}
                    <button onClick={() => setRootTo("father")}>Father</button>{" "}
                    <button onClick={() => setRootTo("mother")}>Mother</button>{" "}
                </div>
                <button onClick={handleUndo}>Undo</button>{" "}
                <button
                    onClick={() => {
                        maxDepth > 0 ? setMaxDepth(maxDepth - 1) : null;
                    }}
                >
                    -
                </button>
                {" " + (maxDepth + 1) + " "}
                <button
                    onClick={() => {
                        maxDepth < 12 ? setMaxDepth(maxDepth + 1) : null;
                    }}
                >
                    +
                </button>{" "}
            </div>
        </React.Fragment>
    );
}
export default SvgContainer;
