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
function board() {
  function initNodes(rootId, maxDepth) {
    let person = generateTree(rootId, maxDepth, parent);
    let rootNode = generateNodes(person, maxDepth);
    beautifyTree(rootNode);
    return rootNode;
  }

  function calcBounds(allNodes) {
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

  function getAllNodes(rootNode) {
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

  const [history, setHistory] = useState([]);
  const [rootId, setRootId] = useState(_rootID);
  const [maxDepth, setMaxDepth] = useState(_maxDepth);
  const [rootNode, setRootNode] = useState(initNodes(_rootID, _maxDepth));
  const [selectedNode, setSelectedNode] = useState(null);
  const allNodes = getAllNodes(rootNode);
  const margin = 50;
  const { xmin, xmax, ymin, ymax } = calcBounds(allNodes);
  let circles = Array.from(Array(maxDepth + 1).keys());

  return (
    <React.Fragment>
      <div className="grid-item-tree" onPointerUp={()=>
                setSelectedNode((currVal) => {
                  currVal && (currVal.selected = false);
                  return null;
                })
             }>
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
              onPointerDown={(node) =>
                setSelectedNode((currVal) => {
                  currVal && (currVal.selected = false);
                  node.selected = true;
                  return node;
                })
              }
            />
          ))}
        </svg>
      </div>
      <div className="grid-item-info">
        <ExtraInfo node={selectedNode}></ExtraInfo>
      </div>
      {/* <div className="grid-item-info">
        <div className="controls">
          {"Set Root "}
          <button onClick={this.handleMakeRoot}>Self</button>{" "}
          <button onClick={() => this.handleParent("father")}>Father</button>{" "}
          <button onClick={() => this.handleParent("mother")}>Mother</button>{" "}
        </div>
        <button onClick={this.handleUndo}>Undo</button>{" "}
        <button onClick={() => this.handlePlusMinus(-1)}>-</button>
        {" " + (this.state.maxLevel + 1) + " "}
        <button onClick={() => this.handlePlusMinus(1)}>+</button>{" "}
      </div> */}
    </React.Fragment>
  );
}

export default board;
