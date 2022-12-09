import React, { useState } from "react";
import { _rootID, _maxDepth } from "../settings";
import { initNodes } from "../helpers/parseGenome";
import SvgContainer from "./svgContainer";

function Board() {
    const [maxDepth, setMaxDepth] = useState(_maxDepth);
    const [rootId, setRootId] = useState(_rootID);
    const rootNode = initNodes(rootId, maxDepth);
    console.log("Rendered Board", rootNode.person.name, maxDepth);

    return (
        <React.Fragment>
            <SvgContainer
                maxDepth={maxDepth}
                rootNode={rootNode}
                setRootId={setRootId}
                setMaxDepth={setMaxDepth}
            ></SvgContainer>
        </React.Fragment>
    );
}

export default Board;
