import React, { Component } from "react";
class Disc extends Component {
    state = {
        rl: 0,
        rh: 250,
        theta: 45, // deg
        phi: -25, //deg
        x: 100,
        y: 100,
    };
    render() {
        const { rl, rh, theta: th, phi, x, y } = this.state;
        const { sin, cos, PI } = Math;
        const deg = PI / 180;
        const p2 = [rl * cos(th * deg), rl * sin(th * deg)];
        const p3 = [rh * cos(th * deg), rh * sin(th * deg)];
        const d = `M${rl},0  A${rl},${rl} 0 0 1 ${p2[0]},${p2[1]}, L${p3[0]} ${p3[1]} A${rh} ${rh} 0,0,0, ${rh} 0z`;
        return (
            <div height={"100vh"}>
                <svg width={"100%"} height={"100vh"}>
                    <rect
                        x={0}
                        y={0}
                        width={"100%"}
                        height={"100%"}
                        fill="gray"
                    ></rect>
                    <rect
                        x={0}
                        y={0}
                        width={"100"}
                        height={"100"}
                        fill="black"
                    ></rect>
                    <g transform={`translate(${x} ${y}) rotate(${phi} 0 0)`}>
                        <path
                            d={d}
                            fill="red"
                            strokeWidth="1"
                            stroke="blue"
                            cursor="pointer"
                        />
                    </g>
                </svg>
            </div>
        );
    }
}

export default Disc;
