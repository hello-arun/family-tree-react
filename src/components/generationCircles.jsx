import React from "react";
import { _R } from "../settings";
function GenerationCircles(props) {
    const { numGeneration } = props;
    let circles = Array.from(Array(numGeneration + 1).keys());

    return (
        <React.Fragment>
            {circles.map((c) => (
                <circle
                    className="generation-circles"
                    cx="0"
                    cy="0"
                    r={c * _R}
                    key={c}
                ></circle>
            ))}
        </React.Fragment>
    );
}

export default GenerationCircles;
