import React, { useState } from "react";
import { calcBounds } from "../helpers/parseGenome";
import PersonSVG from "./drawingElement";
import GenerationCircles from "./generationCircles";

function SvgContainer(props) {
    const {
        numGeneration,
        rootNode,
    } = props;
    const allNodes = rootNode.expandToArray()
    const treeBounds = calcBounds(allNodes)
    let { xmin, xmax, ymin, ymax } = treeBounds;
    const margin = 50;
    return (
        <React.Fragment>
            <svg
                className="svg-tree"
                id="main-board"
                viewBox={`${xmin - margin}  ${ymin - margin} ${
                    xmax - xmin + margin * 2
                } ${ymax - ymin + margin * 2}`}
            >
                <g>
                    <GenerationCircles
                        numGeneration={numGeneration}
                    ></GenerationCircles>
                </g>
                {allNodes.map((node) => (
                    <PersonSVG
                        key={node.person.id}
                        node={node}
                        onPointerDown={(node) => props.onPointerDown(node)}
                    />
                ))}
            </svg>
        </React.Fragment>
    );
}

export default SvgContainer;
