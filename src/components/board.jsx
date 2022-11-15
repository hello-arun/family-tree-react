// This is an SVG element where all the drawing will happen
// based on the JSON Tree Structure
import React, { Component } from "react";
import Disc from "./disc";
import genome from "../data/genome.json";
import setting from "../data/setting.json";
// import CurvedText from "./curvedText";
class Board extends Component {
    state = {
        generations: this.loadData(),
        footerNote: "Focus here for info!!!",
    };

    loadData() {
        const persons = genome.persons;
        const { rootId, gens } = setting;
        return this.getGenerations(persons, rootId, gens);
    }

    getPersonById(persons, id) {
        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (person.id === id) {
                return person;
            }
        }
        return null;
    }

    getGenerations(persons, rootId, maxlevel = 1) {
        let generations = [];
        let members = [];
        let level = 0;
        let currentNode = this.getPersonById(persons, rootId);
        // console.log(currentNode)
        let queue = [];
        queue.push(currentNode);

        while (queue.length && level < maxlevel) {
            let level_size = queue.length;
            let num = 0;
            members = [];
            while (num < level_size) {
                currentNode = queue.shift();
                // console.log(currentNode.id)
                members.push({
                    id: currentNode.id,
                    person: currentNode,
                    level: level,
                    discParams: {
                        id: currentNode.id,
                        rl: 150 + 50 * level,
                        rh: 200 + 50 * level,
                        theta: 180 / level_size,
                        phi: num * (180 / level_size),
                        x: 0,
                        y: 0,
                    },
                });

                // members.push(currentNode.name);
                if (currentNode.relationships) {
                    currentNode.relationships.forEach((relation) => {
                        relation.children.forEach((id) => {
                            queue.push(this.getPersonById(persons, id));
                        });
                    });
                }
                num++;
            }
            generations.push([...members]);
            level++;
        }
        // console.log(generations);
        return generations;
    }
    handleFocus = (person, level = 0) => {
        const generations = [...this.state.generations];
        const members = [...generations[level]];
        const numpeople = members.length;
        if (person.id) {
            const allocatedSpace = ((175 + 50 * level) * 3.14) / numpeople;
            const minimumReqSpace = 90;
            if (allocatedSpace < minimumReqSpace) {
                const req_theta =
                    (180 * minimumReqSpace) / ((175 + 50 * level) * 3.14);
                const available_theta = 180 - req_theta;
                const theta_per_person = available_theta / (numpeople - 1);
                let last_phi = 0;
                for (let i = 0; i < members.length; i++) {
                    if (members[i].id === person.id) {
                        members[i].discParams.phi = last_phi;
                        members[i].discParams.theta = req_theta;
                        last_phi += req_theta;
                    } else {
                        members[i].discParams.phi = last_phi;
                        members[i].discParams.theta = theta_per_person;
                        last_phi += theta_per_person;
                    }
                }
            }
            generations[level] = members;
        } else {
            const theta_per_person = 180 / numpeople;
            let last_phi = 0;
            for (let i = 0; i < members.length; i++) {
                members[i].discParams.phi = last_phi;
                members[i].discParams.theta = theta_per_person;
                last_phi += theta_per_person;
            }
            generations[level] = members;
        }
        // this.setState({generations:generations})
        // console.log("person", numpeople);
        // console.log("space per person", allocatedSpace);
        let parteners = "|";

        person.relationships &&
            person.relationships.forEach((relation) => {
                // console.log(relation.partnerId);
                // console.log(this.getPersonById(genome.persons,relation.partnerId));

                parteners = `${parteners}${
                    this.getPersonById(genome.persons, relation.partnerId).name
                }|`;
            });
        const footerNote = person.id
            ? `Name: ${
                  person.name
              }, Gender: ${person.sex.toUpperCase()}, Partener(s): ${parteners}`
            : person;
        this.setState({ generations: generations, footerNote: footerNote });
    };
    render() {
        // console.log(this.getGenerations(genome.persons, setting.rootId));
        const { generations } = this.state;
        const w = 900;
        const h = 600;
        // console.log(generations);
        return (
            <React.Fragment>
                <div className="grid-item-tree">
                    <svg width={w} height={h} className="svg-tree">
                        <g transform={`translate(${w / 2} ${h})`}>
                            {generations.map((gen) =>
                                gen.map((member) => (
                                    <Disc
                                        key={member.id}
                                        discParams={member.discParams}
                                        person={member.person}
                                        level={member.level}
                                        onFocus={this.handleFocus}
                                    />
                                ))
                            )}
                        </g>
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
