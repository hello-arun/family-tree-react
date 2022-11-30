import React, { Component } from "react";

class PersonSVG extends Component {
    // state = {};
    render() {
        // const rFact = 110;
        // const tFact = 0.51;
        // const dth = Math.PI / 2;
        const { node } = this.props;
        // const { x, level } = node;
        // const r = rFact * level;
        // const theta = -tFact * x + dth;

        const x1 = node.x;
        //  r * Math.cos(theta);
        const y1 = node.y
        // r * Math.sin(theta);

        let x2 = null;
        let y2 = null;
        if (node.parent !== null) {
            // const rP = node.parent.level * rFact;
            // const tP = -node.parent.x * tFact + dth;
            x2 = node.parent.x;
            //  rP * Math.cos(tP);
            y2 = node.parent.y;
            // rP * Math.sin(tP);
        }
        let lineClass = "node-connection ";
        lineClass +=
            node.selected || (node.parent && node.parent.selected)
                ? "selected"
                : "";
        return (
            <React.Fragment>
                if (node.parent!==null)
                {
                    <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className={lineClass}
                    ></line>
                }
                <circle cx={x1} cy={y1} r={5} className={node.person.sex}></circle>
                <g transform={`translate(${x1},${y1})`}>
                    <text
                        className="text-name"
                        x={0}
                        y={0}
                        onMouseEnter={() => {
                            this.props.onPointerEnter(node);
                        }}
                        onMouseLeave={() => this.props.onPointerLeave(node)}
                    >
                        {node.person.name}
                    </text>
                </g>
            </React.Fragment>
        );
    }
}

export default PersonSVG;
