// This is an SVG element where all the drawing will happen
// based on the JSON Tree Structure
import React, { Component } from "react";
import Disc from "./disc";
import genome from "../data/genome.json";
import setting from "../data/setting.json";
// import CurvedText from "./curvedText";
class Board extends Component {
    state = {
        members: this.loadData2(),
    };

    loadData2() {
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
        let level = 0;
        let currentNode = this.getPersonById(persons, rootId);
        // console.log(currentNode)
        let queue = [];
        let members = [];
        queue.push(currentNode);

        while (queue.length && level < maxlevel) {
            let level_size = queue.length;
            let num = 0;
            while (num < level_size) {
                currentNode = queue.shift();
                // console.log(currentNode.id)
                members.push({
                    id: currentNode.id,
                    name: currentNode.name,
                    discParams: {
                        id: currentNode.id,
                        rl: 150 + 50 * level,
                        rh: 200 + 50 * level,
                        theta: 180 / level_size,
                        phi: -(num * 180) / level_size,
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
            level++;
        }
        console.log(members);
        return members;
    }

    render() {
        // console.log(this.getGenerations(genome.persons, setting.rootId));
        const { members } = this.state;
        return (
            <div width="100%" height="100vh">
                <svg width="4000" height="1000" className="center">
                    <g transform="translate(2000 750)">
                        {members.map((member) => (
                            <Disc
                                key={member.id}
                                discParams={member.discParams}
                                name={member.name}
                            />
                        ))}
                    </g>
                </svg>
            </div>
        );
    }
}

export default Board;
