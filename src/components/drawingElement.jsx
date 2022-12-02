import React, { Component } from "react";

class PersonSVG extends Component {
    // state = {};
    render() {
        const { node } = this.props;
        const x1 = node.x;
        const y1 = node.y;

        let x2 = null;
        let y2 = null;
        if (node.parent !== null) {
            x2 = node.parent.x;
            y2 = node.parent.y;
        }
        let lineClass = "node-connection ";
        lineClass +=
            node.selected || (node.parent && node.parent.selected)
                ? "selected"
                : "";
        const circleClass = node.parent.person ? "" : " root-circle";
        const textStyle = node.selected ? "text-name selected" : "text-name";
        return (
            <React.Fragment>
                if (node.parent.person!==null)
                {
                    <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className={`${lineClass}`}
                    ></line>
                }
                <circle
                    cx={x1}
                    cy={y1}
                    r={5}
                    className={`${node.person.sex}  ${circleClass}`}
                ></circle>
                <g transform={`translate(${x1},${y1})`}>
                    <text
                        className={textStyle}
                        x={0}
                        y={0}
                        onPointerDown={(event) => {
                            this.props.onPointerEnter(node);
                        }}
                        onPointerUp={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        {node.person.name}
                    </text>
                </g>
            </React.Fragment>
        );
    }
}

export default PersonSVG;
