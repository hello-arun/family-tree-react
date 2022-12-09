import React, { Component } from "react";
class ExtraInfo extends Component {
    render() {
        const { node } = this.props;
        if (node === null) {
            return (
                <span className=".centered-text">
                    Select any text for extra info!
                </span>
            );
        }
        let mother = "--";
        let father = "--";
        mother = node.person.mother ? node.person.mother.name : "--";
        father = node.person.father ? node.person.father.name : "--";

        return (
            <React.Fragment>
                <span className="node-extra-info">
                    {node.person.name}, Mother: Smt. {mother}, Father: Sh.{" "}
                    {father}, ({node.person.description})
                </span>
            </React.Fragment>
        );
    }
}

export default ExtraInfo;
