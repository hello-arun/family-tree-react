import React, { Component } from "react";
class Disc extends Component {
    state = {
        focused: false,
    };

    onClick = () => {
        console.log(this.props);
    };

    changeState = (isFocused) => {
        // console.log(isFocused)
        this.setState({ focused: isFocused });
    };
    render() {
        const classFocussed = this.state.focused ? "focused" : "";
        const { rl, rh, theta: th, phi, x, y, id } = this.props.discParams;
        const { name } = this.props;
        const { sin, cos, PI } = Math;
        const deg = PI / 180;
        const p2 = [rl * cos(th * deg), rl * sin(th * deg)];
        const p3 = [rh * cos(th * deg), rh * sin(th * deg)];
        const p4 = [
            (rl + rh) * 0.5 * cos(th * deg),
            (rl + rh) * 0.5 * sin(th * deg),
        ];
        const d = `M${rl},0  A${rl},${rl} 0 0 1 ${p2[0]},${p2[1]}, L${p3[0]} ${p3[1]} A${rh} ${rh} 0,0,0, ${rh} 0z`;
        return (
            <g
                onMouseEnter={() => {
                    this.changeState(true);
                    this.props.onFocus(this.props.person, this.props.level);
                }}
                onMouseLeave={() => {
                    this.changeState(false);
                    this.props.onFocus(
                        "Hover over the disk for info!!!",
                        this.props.level
                    );
                }}
                onClick={this.onClick}
                transform={"rotate(180)"}
            >
                <g
                    transform={`translate(${x} ${y}) rotate(${phi} 0 0)`}
                    className={"svg-disc " + classFocussed}
                >
                    <path d={d} title={name} />
                </g>

                <g transform={`translate(${x} ${y}) rotate(${phi} 0 0)`}>
                    <path
                        d={`M ${(rl + rh) * 0.5},0 A${(rl + rh) * 0.5},${
                            (rl + rh) * 0.5
                        } 0 0 1 ${p4[0]},${p4[1]}`}
                        id={id}
                        fill="None"
                    ></path>
                    <text
                        className="svg-disc-text"
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        <textPath
                            startOffset="50%"
                            alignmentBaseline="bottom"
                            href={`#${id}`}
                        >
                            {this.props.person.name}
                        </textPath>
                    </text>
                </g>
            </g>
        );
    }
}

export default Disc;
