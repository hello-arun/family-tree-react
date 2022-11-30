// This is an SVG element where all the drawing will happen
// based on the JSON Tree Structure
import React, { Component } from "react";
import setting from "../data/setting.json";
import { generateNodes, generateTree } from "../helpers/parseGenome";
import PersonSVG from "./drawingElement";
import { beautifyTree } from "../helpers/tidyTree";

class Board extends Component {
    state = {
        rootNode: this.initNodes(),
        footerNote: "Hover over names for additional info!!!",
    };

    initNodes() {
        // console.log("Gi");
        const { rootId, maxLevel } = setting;
        let person = generateTree(rootId, maxLevel);
        let rootNode = generateNodes(person, maxLevel);
        beautifyTree(rootNode);
        // console.log(rootNode);

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
        // const rootNode = rootNode;
        node.selected = true;
        let footerNote = node.person.name;
        if (node.parent === null) {
            footerNote += ", Mother: --, Father: --";
        } else {
            footerNote += `, Mother: Smt. ${node.person.mother.name}, Father: Sh. ${node.person.father.name}`;
        }
        // const footerNote = `${node.person.name}, Mother: Smt. ${node.person.mother.name}, Father: Sh. ${node.person.father.name}`;
        this.setState({
            rootNode: this.state.rootNode,
            footerNote: footerNote,
        });
    };
    handlePointerLeave = (node) => {
        node.selected = false;

        // const rootNode = rootNode;
        // const footerNote = `Name: ${node.person.name}, Mother: ${node.person.mother.name}, Father: ${node.person.father.name}`;
        this.setState({
            rootNode: this.state.rootNode,
            footerNote: "Hover over names for info!!!",
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

    render() {
        const allNodes = this.getNodeArray(this.state.rootNode, 4);
        const {xmin,xmax,ymin,ymax}= this.calcBounds(allNodes)
        const margin=40
        return (
            <React.Fragment>
                <div className="grid-item-tree">
                    <svg className="svg-tree" id="main-board" viewBox={`${xmin-margin}  ${ymin-margin} ${xmax-xmin+margin*2} ${ymax-ymin+margin*2}`}>
                        {console.log(document.getElementsByClassName("svg-tree"))}
                        {/* <g className="svg-tree-group"> */}
                            {/* <g className="svg-tree-scale"> */}
                                {allNodes.map((node) => (
                                    <PersonSVG
                                        key={node.person.id}
                                        node={node}
                                        onPointerEnter={this.handlePointerEnter}
                                        onPointerLeave={this.handlePointerLeave}
                                    />
                                ))}
                            {/* </g> */}
                        {/* </g> */}
                    </svg>
                </div>
                <div className="grid-item-info">
                    <p className=".centered-text">{this.state.footerNote}</p>
                </div>
                <div className="grid-item-footer">
                    <div className="contact-info">
                        <div>
                            © Arun 2022
                            <br />
                            <a
                                href="https://github.com/hello-arun"
                                className="links"
                            >
                                GitHub
                            </a>{" "}
                            <a href="https://twitter.com/jangirarun786">
                                Twitter
                            </a>{" "}
                            <a href="https://www.linkedin.com/in/arun-jangir-ba0921220/">
                                LinkedIn
                            </a>{" "}
                            <a href="mailto:jangirarun786@gmail.com">E-mail</a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Board;
